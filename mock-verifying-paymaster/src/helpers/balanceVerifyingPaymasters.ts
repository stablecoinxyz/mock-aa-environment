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
  pad,
  parseEther,
  slice,
  encodeAbiParameters,
  parseAbiParameters,
} from "viem";
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import {
  ENTRYPOINT_V07_ABI,
} from "./abi";
import { getChain } from "./utils";

import {
  abi as BalanceVerifyingPaymasterAbi,
  bytecode as BalanceVerifyingPaymasterBytecode,
} from "../../artifacts/contracts/BalanceVerifyingPaymaster.sol/BalanceVerifyingPaymaster.json"

import { DETERMINISTIC_DEPLOYER } from "../constants";

const BALANCE_VERIFYING_PAYMASTER_V07_CALL = (owner: Address, sbcToken: Address, requiredBalance: bigint): Hex => concat([
  "0x0000000000000000000000000000000000000000000000000000000000000000",
  BalanceVerifyingPaymasterBytecode as Hex,
  encodeAbiParameters(parseAbiParameters("address _entryPoint, address _sbcToken, uint256 _requiredBalance"), [
    ENTRYPOINT_ADDRESS_V07,
    sbcToken,
    requiredBalance,
  ]),
]) as Hex;

export const setupBalanceVerifyingPaymasterV07 = async (
  walletClient: WalletClient<Transport, Chain, Account>,
  sbcToken: Address,
  requiredBalance: bigint
) => {
  const data = BALANCE_VERIFYING_PAYMASTER_V07_CALL(walletClient.account.address, sbcToken, requiredBalance);

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
    .then(() => console.log("Deployed Balance Verifying Paymaster v0.7"));

  const address = getContractAddress({
    opcode: "CREATE2",
    from: DETERMINISTIC_DEPLOYER,
    salt: slice(data, 0, 32),
    bytecode: slice(data, 32),
  });

  console.log(`Balance Verifying Paymaster v0.7 address: ${address}`);

  const paymaster = getContract({
    address,
    abi: BalanceVerifyingPaymasterAbi,
    client: walletClient,
  });

  const entryPointV7 = getContract({
    address: ENTRYPOINT_ADDRESS_V07,
    abi: ENTRYPOINT_V07_ABI,
    client: walletClient,
  });

  await entryPointV7.write
    .depositTo([paymaster.address], {
      value: parseEther("50"),
    })
    .then(() => console.log("Funded Balance Verifying Paymaster V0.7"));

  return paymaster;
};
