import {
  http,
  type Account,
  type Chain,
  type Hex,
  type Transport,
  type WalletClient,
  createPublicClient,
  getContract,
  parseEther,
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
      args: [ENTRYPOINT_ADDRESS_V07]
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
        deployerWalletClient.account.address,
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
