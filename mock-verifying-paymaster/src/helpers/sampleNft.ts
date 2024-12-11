import {
  http,
  type Account,
  type Address,
  type Chain,
  type Hex,
  type Transport,
  type WalletClient,
  concat,
  createPublicClient,
  getContract,
  getContractAddress,
  slice,
  encodeAbiParameters,
} from "viem";
import { getChain } from "./utils";

import {
  abi as nftAbi,
  bytecode as nftBytecode,
} from "../../artifacts/contracts/SampleNFT.sol/SampleNFT.json";
import { parseAbiParameters } from "viem";

const DETERMINISTIC_DEPLOYER = "0x4e59b44847b379578588920ca78fbf26c0b4956c";

const SAMPLE_NFT_CALL = (): Hex =>
  concat([
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    nftBytecode as Hex,
    encodeAbiParameters(parseAbiParameters("string name, string symbol"), [
      "SampleNFT",
      "SNFT",
    ]),
  ]);

export const setupSampleNft = async (
  walletClient: WalletClient<Transport, Chain, Account>
) => {
  const data = SAMPLE_NFT_CALL();

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
    .then(() => console.log("deployed SampleNFT"));

  const address = getContractAddress({
    opcode: "CREATE2",
    from: DETERMINISTIC_DEPLOYER,
    salt: slice(data, 0, 32),
    bytecode: slice(data, 32),
  });

  console.log(`SampleNFT address deployed at: ${address}`);

  const nft = getContract({
    address,
    abi: nftAbi,
    client: walletClient,
  });

  return nft;
};
