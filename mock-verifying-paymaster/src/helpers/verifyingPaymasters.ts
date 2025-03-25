import {
  http,
  type Account,
  type Address,
  type Chain,
  type Hex,
  type Transport,
  type WalletClient,
  type Hash,
  concat,
  createPublicClient,
  getContract,
  getContractAddress,
  pad,
  parseEther,
  slice,
  parseAbiParameters,
  encodeAbiParameters,
} from "viem";
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import {
  ENTRYPOINT_V07_ABI,
} from "./abi";
import { getChain } from "./utils";

import {
  abi as PaymasterV07Abi,
  bytecode as PaymasterV07Bytecode,
} from "../../artifacts/contracts/SignatureVerifyingPaymasterV07.sol/SignatureVerifyingPaymasterV07.json";

import {
  abi as FactoryAbi,
  bytecode as FactoryBytecode,
} from "../../artifacts/contracts/SignatureVerifyingPaymasterV07Factory.sol/SignatureVerifyingPaymasterV07Factory.json";

const DETERMINISTIC_DEPLOYER = "0x4e59b44847b379578588920ca78fbf26c0b4956c";

// /**
//  * Creates the call that deploys the VerifyingPaymaster v0.7
//  * @param trustedSigner - The address of the trusted signer
//  * @param owner - The address of the owner
//  * @returns The call data for the deployment
//  */
// const SBC_PAYMASTER_V07_CALL = (trustedSigner: Address, owner: Address): Hex => {
//   // Properly encode constructor parameters
//   const constructorArgs = encodeAbiParameters(
//     parseAbiParameters("address _entryPoint, address _verifyingSigner, address _owner"), 
//     [ENTRYPOINT_ADDRESS_V07, trustedSigner, owner]
//   );

//   // Log key details to verify inputs
//   console.log("Bytecode length:", (PaymasterV07Bytecode as string).length);
//   console.log("ConstructorArgs length:", constructorArgs.length);
//   console.log("ConstructorArgs:", constructorArgs);
  
//   // Concatenate salt + bytecode + constructor args
//   return concat([
//     "0x0000000000000000000000000000000000000000000000000000000000000000", // salt
//     PaymasterV07Bytecode as Hex,
//     constructorArgs
//   ]);
// }

interface ComputedAddresses {
  implementation: Address;
  proxyAdmin: Address;
  proxy: Address;
}

export const setupSbcPaymasterV07 = async (
  deployerWalletClient: WalletClient<Transport, Chain, Account>,
  ownerWalletClient: WalletClient<Transport, Chain, Account>
) => {
  const publicClient = createPublicClient({
    transport: http(process.env.ANVIL_RPC),
    chain: await getChain(),
  });

  try {
    // 1. Deploy the factory first
    console.log("Deploying factory...");
    
    // Verify factory bytecode is not empty
    if (!FactoryBytecode || FactoryBytecode === "0x") {
      throw new Error("Factory bytecode is empty. Make sure contracts are compiled.");
    }

    const factoryDeployHash = await deployerWalletClient.deployContract({
      abi: FactoryAbi,
      bytecode: FactoryBytecode as `0x${string}`,
      args: [],
    });

    const factoryReceipt = await publicClient.waitForTransactionReceipt({ hash: factoryDeployHash });
    const factoryAddress = factoryReceipt.contractAddress;
    if (!factoryAddress) throw new Error("Factory deployment failed");
    console.log("Factory deployed to:", factoryAddress);

    // Verify implementation bytecode is not empty
    if (!PaymasterV07Bytecode || PaymasterV07Bytecode === "0x") {
      throw new Error("Paymaster implementation bytecode is empty. Make sure contracts are compiled.");
    }

    // Get factory instance at deployed address
    const factoryContract = getContract({
      address: factoryAddress,
      abi: FactoryAbi,
      client: deployerWalletClient,
    });

    // 2. Deploy the paymaster system using factory
    console.log("\nDeploying paymaster system...");
    console.log("EntryPoint:", ENTRYPOINT_ADDRESS_V07);
    console.log("Verifying Signer:", deployerWalletClient.account.address);
    console.log("Owner:", ownerWalletClient.account.address);

    // First simulate the deployment to check for issues
    try {
      const { request } = await factoryContract.simulate.deployPaymaster([
        ENTRYPOINT_ADDRESS_V07,
        deployerWalletClient.account.address,
        ownerWalletClient.account.address
      ]);
      console.log("Simulation successful. Proceeding with deployment...");
    } catch (simError) {
      console.error("Deployment simulation failed:", simError);
      throw new Error(`Deployment simulation failed: ${simError.message}`);
    }

    // Proceed with actual deployment
    const deployTx = await factoryContract.write.deployPaymaster([
      ENTRYPOINT_ADDRESS_V07,
      deployerWalletClient.account.address,
      ownerWalletClient.account.address
    ], {
      gas: 5000000n,
      maxFeePerGas: 3000000000n,
      maxPriorityFeePerGas: 1500000000n
    }) as Hash;

    console.log("Deployment transaction sent:", deployTx);
    const deployReceipt = await publicClient.waitForTransactionReceipt({ 
      hash: deployTx,
      timeout: 60_000 // 60 second timeout
    });

    console.log("Deploy receipt status:", deployReceipt.status);
    
    // Handle BigInt serialization in logs
    const serializableLogs = deployReceipt.logs.map(log => ({
      ...log,
      logIndex: Number(log.logIndex),
      transactionIndex: Number(log.transactionIndex),
      blockNumber: Number(log.blockNumber),
      // Convert other potential BigInt values to strings
      data: log.data,
      topics: log.topics
    }));
    
    console.log("Deploy receipt logs:", JSON.stringify(serializableLogs, null, 2));
    
    if (deployReceipt.status === 'reverted') {
      throw new Error("Deployment transaction reverted");
    }

    if (!deployReceipt.logs || deployReceipt.logs.length === 0) {
      // Try to get the proxy address through a different method
      const events = await factoryContract.getEvents.ProxyDeployed();
      if (events && events.length > 0) {
        // Cast the event log to the expected type
        const event = events[0] as unknown as { 
          args: { proxy: Address } 
        };
        const proxyAddress = event.args.proxy;
        console.log("Found proxy address from events:", proxyAddress);
      } else {
        throw new Error("No logs or events found in deployment receipt. Deployment likely failed.");
      }
    }

    // Get the proxy address from the transaction logs
    const proxyAddress = deployReceipt.logs[deployReceipt.logs.length - 1].address;
    console.log("Paymaster system deployed!");
    console.log("Proxy address (use this as your paymaster address):", proxyAddress);
    console.log("Transaction hash:", deployTx);

    // Verify the deployment
    const code = await publicClient.getBytecode({ address: proxyAddress });
    if (!code || code === "0x") {
      throw new Error("Deployed proxy has no code");
    }

    // 3. Get paymaster instance
    const paymaster = getContract({
      address: proxyAddress,
      abi: PaymasterV07Abi,
      client: deployerWalletClient,
    });

    // 4. Fund the paymaster through EntryPoint
    const entryPointV7 = getContract({
      address: ENTRYPOINT_ADDRESS_V07,
      abi: ENTRYPOINT_V07_ABI,
      client: deployerWalletClient,
    });

    await entryPointV7.write.depositTo([proxyAddress], {
      value: parseEther("50"),
    });
    console.log("Funded SBC Paymaster V0.7");

    return paymaster;
  } catch (error) {
    console.error("Detailed error:", JSON.stringify(error, null, 2));
    // Additional error context
    if (error.message?.includes("0xb06ebf3d")) {
      console.error("\nCreate2EmptyBytecode error detected. This usually means:");
      console.error("1. The contracts haven't been compiled");
      console.error("2. The bytecode is not being loaded correctly");
      console.error("3. The wrong artifact paths are being used");
      console.error("\nTry running 'npx hardhat compile' first.");
    }
    throw error;
  }
};

// export const setupVerifyingPaymasterV07 = async (
//   walletClient: WalletClient<Transport, Chain, Account>
// ) => {
//   const data = VERIFYING_PAYMASTER_V07_CALL(walletClient.account.address);

//   const publicClient = createPublicClient({
//     transport: http(process.env.ANVIL_RPC),
//     chain: await getChain(),
//   });

//   await walletClient
//     .sendTransaction({
//       to: DETERMINISTIC_DEPLOYER,
//       data,
//     })
//     .then((hash) => publicClient.waitForTransactionReceipt({ hash }))
//     .then(() => console.log("deployed VerifyingPaymaster v0.7"));

//   const address = getContractAddress({
//     opcode: "CREATE2",
//     from: DETERMINISTIC_DEPLOYER,
//     salt: slice(data, 0, 32),
//     bytecode: slice(data, 32),
//   });

//   const verifyingPaymaster = getContract({
//     address,
//     abi: VERIFYING_PAYMASTER_V07_ABI,
//     client: walletClient,
//   });

//   await verifyingPaymaster.write
//     .deposit({
//       value: parseEther("50"),
//     })
//     .then(() => console.log("Funded VerifyingPaymaster V0.7"));

//   return verifyingPaymaster;
// };

// export const setupVerifyingPaymasterV06 = async (
//   walletClient: WalletClient<Transport, Chain, Account>
// ) => {
//   const data = VERIFYING_PAYMASTER_V06_CALL(walletClient.account.address);

//   const publicClient = createPublicClient({
//     transport: http(process.env.ANVIL_RPC),
//     chain: await getChain(),
//   });

//   await walletClient
//     .sendTransaction({
//       to: DETERMINISTIC_DEPLOYER,
//       data,
//     })
//     .then((hash) => publicClient.waitForTransactionReceipt({ hash }))
//     .then(() => console.log("deployed VerifyingPaymaster v0.6"));

//   const address = getContractAddress({
//     opcode: "CREATE2",
//     from: DETERMINISTIC_DEPLOYER,
//     salt: slice(data, 0, 32),
//     bytecode: slice(data, 32),
//   });

//   const verifyingPaymaster = getContract({
//     address,
//     abi: VERIFYING_PAYMASTER_V06_ABI,
//     client: walletClient,
//   });

//   await verifyingPaymaster.write
//     .deposit({
//       value: parseEther("50"),
//     })
//     .then(() => console.log("Funded VerifyingPaymaster V0.6"));

//   return verifyingPaymaster;
// };
