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
  encodeFunctionData,
} from "viem";
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import {
  ENTRYPOINT_V07_ABI,
} from "./abi";
import { getChain } from "./utils";

import {
  abi as PaymasterV07Abi,
  bytecode as PaymasterV07Bytecode,
} from "../abi/contracts/SignatureVerifyingPaymasterV07.sol/SignatureVerifyingPaymasterV07.json";

import {
  abi as ProxyAbi,
  bytecode as ProxyBytecode,
} from "../abi/@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol/ERC1967Proxy.json";

// const DETERMINISTIC_DEPLOYER = "0x4e59b44847b379578588920ca78fbf26c0b4956c";

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
    // 1. Deploy the implementation contract
    console.log("Deploying implementation contract...");
    const implementationDeployTx = await deployerWalletClient.deployContract({
      abi: PaymasterV07Abi,
      bytecode: PaymasterV07Bytecode as Hex,
      args: []
    });

    const implementationReceipt = await publicClient.waitForTransactionReceipt({
      hash: implementationDeployTx
    });

    if (!implementationReceipt.contractAddress) {
      throw new Error("Implementation deployment failed");
    }

    const implementationAddress = implementationReceipt.contractAddress;
    console.log(`Implementation deployed to: ${implementationAddress}`);

    // 2. Prepare initialization data
    const initializeFunction = PaymasterV07Abi.find((item: any) => 
      item.type === 'function' && item.name === 'initialize'
    );

    if (!initializeFunction) {
      throw new Error('Initialize function not found in ABI');
    }

    const initData = encodeFunctionData({
      abi: [initializeFunction],
      functionName: 'initialize',
      args: [
        ENTRYPOINT_ADDRESS_V07, 
        deployerWalletClient.account.address, // Using deployer as trusted signer
        ownerWalletClient.account.address  
      ]
    });

    // 3. Deploy the proxy
    console.log("Deploying proxy contract...");
    const proxyDeployTx = await deployerWalletClient.deployContract({
      abi: ProxyAbi,
      bytecode: ProxyBytecode as Hex,
      args: [implementationAddress, initData]
    });

    const proxyReceipt = await publicClient.waitForTransactionReceipt({
      hash: proxyDeployTx
    });

    if (!proxyReceipt.contractAddress) {
      throw new Error("Proxy deployment failed");
    }

    const proxyAddress = proxyReceipt.contractAddress;
    console.log(`Proxy deployed to: ${proxyAddress}`);

    // 4. Get the paymaster instance (proxy with implementation ABI)
    const paymaster = getContract({
      address: proxyAddress,
      abi: PaymasterV07Abi,
      client: deployerWalletClient,
    });

    // 5. Verify initialization
    console.log('\nVerifying initialization...');
    const [owner, entryPoint, verifyingSigner, version] = await Promise.all([
      paymaster.read.owner([]),
      paymaster.read.entryPoint([]),
      paymaster.read.verifyingSigner([]),
      paymaster.read.VERSION([])
    ]);

    console.log(`Owner: ${owner}`);
    console.log(`EntryPoint: ${entryPoint}`);
    console.log(`Verifying Signer: ${verifyingSigner}`);
    console.log(`Version: ${version}`);

    // 6. Fund the paymaster through EntryPoint
    const entryPointContract = getContract({
      address: ENTRYPOINT_ADDRESS_V07,
      abi: ENTRYPOINT_V07_ABI,
      client: deployerWalletClient,
    });

    await entryPointContract.write.depositTo([proxyAddress], {
      value: parseEther("50"),
    });
    console.log("Funded SBC Paymaster V0.7");

    return paymaster;
  } catch (error) {
    console.error("Detailed error:", JSON.stringify(error, null, 2));
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
