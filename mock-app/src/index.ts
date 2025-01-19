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
  createWalletClient,
} from "viem";
import { createSmartAccountClient } from "permissionless";
import { nftAbi, sbcAbi } from "./abi";

// Environment variables defined in docker-compose.yml
const ANVIL_RPC = process.env.ANVIL_RPC!;
const BUNDLER_RPC = process.env.ALTO_RPC!;
const PAYMASTER_RPC = process.env.PAYMASTER_RPC!;

// The address of the NFT contract we deployed with mock-paymaster
const NFT_CONTRACT_ADDRESS = "0xb819edABAEccc6E0eE44371a9A2Df019493DBb58";

// The address of the SBC contract we deployed with mock-paymaster
const SBC_CONTRACT_ADDRESS = "0xb0D3a3603221a6F2c069183b06Cd40C5e717967e";

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
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
);

const ownerWalletClient = createWalletClient({
  account: owner,
  transport: http(ANVIL_RPC),
});

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
          maxFeePerGas: 100n,
          maxPriorityFeePerGas: 100n,
        };
      },
    },
  });

  console.log(`Owner Address: ${owner.address}`);
  console.log(`Smart Account Address: ${smartAccountClient.account.address}`);

  // --------------------------------------------------------------------------
  // Owner transfers SBC to its associated smart account
  // --------------------------------------------------------------------------
  // DEV: change this value to test whether the BalanceVerifyingPaymaster is working
  const amountToTransfer = 100n * 10n ** 18n; // 100 SBC in Wei  
  // const amountToTransfer = 99n * 10n ** 18n; // 99 SBC in Wei  
  // --------------------------------------------------------------------------

  const transferData = encodeFunctionData({
    abi: sbcAbi,
    functionName: "transfer",
    args: [smartAccountClient.account.address, amountToTransfer],
  });

  // Transfer SBC to the smart account
  const txHashTransfer = await ownerWalletClient.sendTransaction({
    chain: localAnvil,
    to: SBC_CONTRACT_ADDRESS,
    data: transferData,
  });

  console.log(`Transfer Transaction Hash: ${txHashTransfer}`);

  // Wait for the transfer to be confirmed
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log(`Successfully transferred ${amountToTransfer/10n**18n} SBC to Smart Account ${smartAccountClient.account.address}`);

  // Encode the calldata for mint function
  const callData = encodeFunctionData({
    abi: nftAbi,
    functionName: "mintNFT",
    args: [smartAccountClient.account.address],
  });

  // Now we send our user operation (mint an NFT to the smart account).
  const txHash = await smartAccountClient
    .sendTransaction({
      to: NFT_CONTRACT_ADDRESS,
      data: callData,
    })
    .catch((error) => {
      console.log("                                       ");
      console.log("                                       ");
      console.error("\x1b[31m", `❌ Failed to mint NFT: ${error.message}`);
      console.log("                                       ");
      console.log("                                       ");
      process.exit(1);
    });

  console.log("                                       ");
  console.log("                                       ");
  console.debug("NFT Minted! Transaction Hash:", txHash);
  console.log("                                       ");
  console.log("                                       ");

  // We can check the owner of the NFT by calling the `ownerOf` function.
  const ownerOfCallData = encodeFunctionData({
    abi: nftAbi,
    functionName: "ownerOf",
    args: [BigInt(1)], // tokenId starts at 1
  });

  const ownerOfNft = await localPublicClient.call({
    to: NFT_CONTRACT_ADDRESS,
    data: ownerOfCallData,
  });

  const ownerOfNftAddress = decodeFunctionResult({
    abi: nftAbi,
    functionName: "ownerOf",
    data: ownerOfNft.data as Hex,
  });

  console.log("                                       ");
  console.log("                                       ");
  console.log("                                       ");
  console.log("***************************************");
  console.log(`Owner of NFT Address : ${ownerOfNftAddress}`);
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
