import { Account, Chain, Hex, Transport, WalletClient, concat, createPublicClient, encodeAbiParameters, getContract, getContractAddress, http, parseAbiParameters, slice } from "viem";
import {
  abi as SbcAbi,
  bytecode as SbcBytecode,
} from "../../artifacts/contracts/SampleERC20.sol/SBC.json";
import { DETERMINISTIC_DEPLOYER } from "../constants";
import { getChain } from "./utils";

const SBC_ERC20_CALL = concat([
  "0x0000000000000000000000000000000000000000000000000000000000000000",
  SbcBytecode as Hex,
  encodeAbiParameters(parseAbiParameters("string name, string symbol"), [
    "SampleERC20",
    "SBC",
  ]),
]);

export const setupSampleErc20 = async (
  walletClient: WalletClient<Transport, Chain, Account>, 
  numTokens: bigint
) => {
  const data = SBC_ERC20_CALL;

  const publicClient = createPublicClient({
    transport: http(process.env.ANVIL_RPC),
    chain: await getChain(),
  });

  await walletClient
    .sendTransaction({
      to: DETERMINISTIC_DEPLOYER,
      data,
    })
    .then((hash) => publicClient.waitForTransactionReceipt({ hash }))
    .then(() => console.log("deployed SBC ERC20 Test Token"));

  const address = getContractAddress({
    opcode: "CREATE2",
    from: DETERMINISTIC_DEPLOYER,
    salt: slice(data, 0, 32),
    bytecode: slice(data, 32),
  });

  console.log(`SBC ERC20 Test Token address: ${address}`);

  const sampleErc20 = getContract({
    address,
    abi: SbcAbi,
    client: walletClient,
  });

  // Mint numTokens tokens to walletClient
  const mintTx = await sampleErc20.write.mint([
    walletClient.account.address,
    numTokens * 10n ** 18n, // number of tokens with 18 decimals
  ]);
  await publicClient.waitForTransactionReceipt({ hash: mintTx });

  console.log(`Minted ${numTokens} tokens to ${walletClient.account.address}`);

  return sampleErc20;
};
