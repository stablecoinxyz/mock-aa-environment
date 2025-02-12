import { toSimpleSmartAccount } from "permissionless/accounts";
import { privateKeyToAccount } from "viem/accounts";
import {
  createPaymasterClient,
  entryPoint07Address,
} from "viem/account-abstraction";
import {
  http,
  createPublicClient,
  defineChain,
  PublicClient,
  encodeFunctionData,
  decodeFunctionResult,
  Hex,
} from "viem";
import { createSmartAccountClient } from "permissionless";
import { nftAbi } from "./abi";

// Environment variables defined in docker-compose.yml
const ANVIL_RPC = process.env.ANVIL_RPC!;
const BUNDLER_RPC = process.env.ALTO_RPC!;
const PAYMASTER_RPC = process.env.PAYMASTER_RPC!;

// The address of the NFT contract we deployed with mock-paymaster
const NFT_CONTRACT_ADDRESS = "0xb819edABAEccc6E0eE44371a9A2Df019493DBb58";

// Define our local anvil chain
const localAnvil = defineChain({
  id: 31337,
  name: "local",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: [ANVIL_RPC] },
  },
});

// Create a public client for reading the local anvil chain.
const localPublicClient = createPublicClient({
  chain: localAnvil,
  transport: http(localAnvil.rpcUrls.default.http[0]),
}) as PublicClient;

// The owner of the smart account.
// - This is one of the ten private keys available at the start of the local anvil node.
// - Do NOT use this private key in production.
const owner = privateKeyToAccount(
  "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
);

async function main() {
  // Create a simple smart account using the owner and the entry point v0.7 address.
  const simpleAccount = await toSimpleSmartAccount({
    client: localPublicClient,
    owner: owner,
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    },
  });

  console.log(`Smart Account Address: ${simpleAccount.address}`);

  // Create a client for our custom paymaster service.
  const pmClient = createPaymasterClient({
    transport: http(PAYMASTER_RPC),
  });

  // Create the smart account client with owner's wallet and paymasterClient
  const smartAccountClient = createSmartAccountClient({
    account: simpleAccount,
    chain: localAnvil,
    bundlerTransport: http(BUNDLER_RPC),
    paymaster: pmClient,
    userOperation: {
      estimateFeesPerGas: async () => {
        return {
          maxFeePerGas: 10n,
          maxPriorityFeePerGas: 10n,
        };
      },
    },
  });

  // Encode the calldata for mint function
  const callData = encodeFunctionData({
    abi: nftAbi,
    functionName: "mintNFT",
    args: [smartAccountClient.account.address],
  });

  // Now we send our user operation (mint an NFT to the smart account).
  const txHash = await smartAccountClient
    .sendTransaction({
      account: smartAccountClient.account,
      to: NFT_CONTRACT_ADDRESS,
      data: callData,
      value: BigInt(0),
    })
    .catch((error) => {
      console.error("\x1b[31m", `❌ ${error.message}`);
      process.exit(1);
    });

  console.log("                                       ");
  console.log("                                       ");
  console.debug("NFT Minted! Transaction Hash:", txHash);
  console.log("                                       ");
  console.log("                                       ");

  // We can check the owner of the NFT by calling the `ownerOf` function.
  const ownerOfNft = await localPublicClient.readContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: "ownerOf",
    args: [BigInt(1)],
  });

  console.log(`Owner of NFT: ${ownerOfNft}`);

  console.log("                                       ");
  console.log("                                       ");
  console.log("                                       ");
  console.log("***************************************");
  console.log(`Owner of NFT Address : ${ownerOfNft}`);
  console.log(`Smart Account Address: ${smartAccountClient.account.address}`);
  console.log("***************************************");
  console.log("                                       ");
  console.log("                                       ");
  console.log("                                       ");
}

main()
  .then(() => {
    console.log("***************************************");
    console.log("***************************************");
    console.log("*************             *************");
    console.log("*************    DONE!    *************");
    console.log("*************             *************");
    console.log("***************************************");
    console.log("***************************************");
    console.log("                                       ");
    console.log("                                       ");
    console.log("                                       ");
  })
  .catch(console.error);
