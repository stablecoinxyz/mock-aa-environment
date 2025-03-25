import { AddressLike, BigNumberish, BytesLike } from "ethers";

export interface UserOperation {
  sender: AddressLike;
  nonce: BigNumberish;
  initCode: BytesLike;
  callData: BytesLike;
  accountGasLimits: BytesLike;
  preVerificationGas: BigNumberish;
  gasFees: BytesLike;
  paymasterAndData: BytesLike;
  signature: BytesLike;
} 