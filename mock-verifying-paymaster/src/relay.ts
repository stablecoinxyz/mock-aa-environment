import util from "node:util";
import type { FastifyReply, FastifyRequest } from "fastify";
import {
  type Account,
  BaseError,
  type Chain,
  type GetContractReturnType,
  type Hex,
  type PublicClient,
  type RpcRequestError,
  type Transport,
  type WalletClient,
  hexToBytes,
  toHex,
} from "viem";
import { fromZodError } from "zod-validation-error";
import {
  ENTRYPOINT_ADDRESS_V07,
  type EstimateUserOperationGasReturnType,
} from "permissionless";
import type { PimlicoBundlerClient } from "permissionless/clients/pimlico";
import type {
  ENTRYPOINT_ADDRESS_V07_TYPE,
  UserOperation,
} from "permissionless/types";
import {
  InternalBundlerError,
  type JsonRpcSchema,
  RpcError,
  ValidationErrors,
  jsonRpcSchema,
  pmGetPaymasterData,
  pmGetPaymasterStubDataParamsSchema,
  pmSponsorUserOperationParamsSchema,
} from "./helpers/schema";
import {
  abi as PaymasterV07Abi,
  bytecode as PaymasterV07Bytecode,
} from "../artifacts/contracts/SignatureVerifyingPaymasterV07.sol/SignatureVerifyingPaymasterV07.json";
import { keccak256 } from "viem";

// Constants
const PAYMASTER_VERSION = "5";

// const handleMethodV06 = async (
//   userOperation: UserOperation<"v0.6">,
//   altoBundlerV06: PimlicoBundlerClient<ENTRYPOINT_ADDRESS_V06_TYPE>,
//   verifyingPaymasterV06: GetContractReturnType<
//     typeof VERIFYING_PAYMASTER_V06_ABI,
//     PublicClient<Transport, Chain>
//   >,
//   walletClient: WalletClient<Transport, Chain, Account>,
//   estimateGas: boolean
// ) => {
//   let op = {
//     ...userOperation,
//     paymasterAndData: concat([
//       verifyingPaymasterV06.address,
//       "0x000000000000000000000000000000000000000000000000000000006602f66a0000000000000000000000000000000000000000000000000000000000000000dba7a71bd49ae0174b1e4577b28f8b7c262d4085cfa192f1c19b516c85d2d1ef17eadeb549d71caf5d5f24fb6519088c1c13427343843131dd6ec19a3c6a350e1b",
//     ]),
//   };

//   const callGasLimit = userOperation.callGasLimit;
//   const verificationGasLimit = userOperation.verificationGasLimit;
//   const preVerificationGas = userOperation.preVerificationGas;

//   if (estimateGas) {
//     let gasEstimates:
//       | EstimateUserOperationGasReturnType<ENTRYPOINT_ADDRESS_V06_TYPE>
//       | undefined = undefined;
//     try {
//       gasEstimates = await altoBundlerV06.estimateUserOperationGas({
//         userOperation: op,
//       });
//     } catch (e: unknown) {
//       if (!(e instanceof BaseError)) throw new InternalBundlerError();
//       const err = e.walk() as RpcRequestError;
//       throw err;
//     }

//     op = {
//       ...op,
//       ...gasEstimates,
//     };

//     op.callGasLimit = maxBigInt(op.callGasLimit, callGasLimit);
//     op.preVerificationGas = maxBigInt(
//       op.preVerificationGas,
//       preVerificationGas
//     );
//     op.verificationGasLimit = maxBigInt(
//       op.verificationGasLimit,
//       verificationGasLimit
//     );
//   } else if (
//     userOperation.preVerificationGas === 1n ||
//     userOperation.verificationGasLimit === 1n ||
//     userOperation.callGasLimit === 1n
//   ) {
//     throw new RpcError(
//       "Gas Limit values (preVerificationGas, verificationGasLimit, callGasLimit) must be set",
//       ValidationErrors.InvalidFields
//     );
//   }

//   const validAfter = 0;
//   const validUntil = 0;
//   op.paymasterAndData = concat([
//     verifyingPaymasterV06.address,
//     encodeAbiParameters(
//       [
//         { name: "validUntil", type: "uint48" },
//         { name: "validAfter", type: "uint48" },
//       ],
//       [validUntil, validAfter]
//     ),
//     toHex(0, { size: 65 }),
//   ]);
//   const hash = await verifyingPaymasterV06.read.getHash([
//     op,
//     validUntil,
//     validAfter,
//   ]);
//   const sig = await walletClient.signMessage({
//     message: { raw: hash },
//   });
//   const paymasterAndData = concat([
//     verifyingPaymasterV06.address,
//     encodeAbiParameters(
//       [
//         { name: "validUntil", type: "uint48" },
//         { name: "validAfter", type: "uint48" },
//       ],
//       [validUntil, validAfter]
//     ),
//     sig,
//   ]);

//   const result = {
//     preVerificationGas: toHex(op.preVerificationGas),
//     callGasLimit: toHex(op.callGasLimit),
//     verificationGasLimit: toHex(op.verificationGasLimit || 0),
//     paymasterAndData,
//   };

//   return result;
// };

// const handleMethodV07 = async (
//   userOperation: UserOperation<"v0.7">,
//   altoBundlerV07: PimlicoBundlerClient<ENTRYPOINT_ADDRESS_V07_TYPE>,
//   verifyingPaymasterV07: GetContractReturnType<
//     typeof VERIFYING_PAYMASTER_V07_ABI,
//     PublicClient<Transport, Chain>
//   >,
//   walletClient: WalletClient<Transport, Chain, Account>,
//   estimateGas: boolean
// ) => {
//   let op = {
//     ...userOperation,
//     paymaster: verifyingPaymasterV07.address,
//     paymasterData:
//       "0x000000000000000000000000000000000000000000000000000000006602f66a0000000000000000000000000000000000000000000000000000000000000000dba7a71bd49ae0174b1e4577b28f8b7c262d4085cfa192f1c19b516c85d2d1ef17eadeb549d71caf5d5f24fb6519088c1c13427343843131dd6ec19a3c6a350e1b" as Hex,
//   };

//   const callGasLimit = userOperation.callGasLimit;
//   const verificationGasLimit = userOperation.verificationGasLimit;
//   const preVerificationGas = userOperation.preVerificationGas;

//   if (estimateGas) {
//     let gasEstimates:
//       | EstimateUserOperationGasReturnType<ENTRYPOINT_ADDRESS_V07_TYPE>
//       | undefined = undefined;
//     try {
//       gasEstimates = await altoBundlerV07.estimateUserOperationGas({
//         userOperation: op,
//       });
//     } catch (e: unknown) {
//       if (!(e instanceof BaseError)) throw new InternalBundlerError();
//       const err = e.walk() as RpcRequestError;
//       throw err;
//     }

//     op = {
//       ...op,
//       ...gasEstimates,
//     };

//     op.callGasLimit = maxBigInt(op.callGasLimit, callGasLimit);
//     op.preVerificationGas = maxBigInt(
//       op.preVerificationGas,
//       preVerificationGas
//     );
//     op.verificationGasLimit = maxBigInt(
//       op.verificationGasLimit,
//       verificationGasLimit
//     );
//   } else if (
//     userOperation.preVerificationGas === 1n ||
//     userOperation.verificationGasLimit === 1n ||
//     userOperation.callGasLimit === 1n
//   ) {
//     throw new RpcError(
//       "Gas Limit values (preVerificationGas, verificationGasLimit, callGasLimit) must be set",
//       ValidationErrors.InvalidFields
//     );
//   }

//   const validAfter = 0;
//   const validUntil = 0;
//   op.paymasterData = concat([
//     encodeAbiParameters(
//       [
//         { name: "validUntil", type: "uint48" },
//         { name: "validAfter", type: "uint48" },
//       ],
//       [validUntil, validAfter]
//     ),
//     toHex(0, { size: 65 }),
//   ]);
//   op.paymaster = verifyingPaymasterV07.address;
//   const hash = await verifyingPaymasterV07.read.getHash([
//     getPackedUserOperation(op),
//     validUntil,
//     validAfter,
//   ]);
//   const sig = await walletClient.signMessage({
//     message: { raw: hash },
//   });
//   const paymaster = verifyingPaymasterV07.address;
//   const paymasterData = concat([
//     encodeAbiParameters(
//       [
//         { name: "validUntil", type: "uint48" },
//         { name: "validAfter", type: "uint48" },
//       ],
//       [validUntil, validAfter]
//     ),
//     sig,
//   ]);

//   const result = {
//     preVerificationGas: toHex(op.preVerificationGas),
//     callGasLimit: toHex(op.callGasLimit),
//     paymasterVerificationGasLimit: toHex(op.paymasterVerificationGasLimit || 0),
//     paymasterPostOpGasLimit: toHex(op.paymasterPostOpGasLimit || 0),
//     verificationGasLimit: toHex(op.verificationGasLimit || 0),
//     paymaster,
//     paymasterData,
//   };

//   return result;
// };

// const handleMethod = async (
//   altoBundlerV07: PimlicoBundlerClient<ENTRYPOINT_ADDRESS_V07_TYPE>,
//   altoBundlerV06: PimlicoBundlerClient<ENTRYPOINT_ADDRESS_V06_TYPE>,
//   verifyingPaymasterV07: GetContractReturnType<
//     typeof VERIFYING_PAYMASTER_V07_ABI,
//     PublicClient<Transport, Chain>
//   >,
//   verifyingPaymasterV06: GetContractReturnType<
//     typeof VERIFYING_PAYMASTER_V06_ABI,
//     PublicClient<Transport, Chain>
//   >,
//   walletClient: WalletClient<Transport, Chain, Account>,
//   parsedBody: JsonRpcSchema
// ) => {
//   if (parsedBody.method === "pm_sponsorUserOperation") {
//     const params = pmSponsorUserOperationParamsSchema.safeParse(
//       parsedBody.params
//     );

//     if (!params.success) {
//       throw new RpcError(
//         fromZodError(params.error).message,
//         ValidationErrors.InvalidFields
//       );
//     }

//     const [userOperation, entryPoint] = params.data;

//     if (entryPoint === ENTRYPOINT_ADDRESS_V07) {
//       return await handleMethodV07(
//         userOperation as UserOperation<"v0.7">,
//         altoBundlerV07,
//         verifyingPaymasterV07,
//         walletClient,
//         true
//       );
//     }

//     if (entryPoint === ENTRYPOINT_ADDRESS_V06) {
//       return await handleMethodV06(
//         userOperation as UserOperation<"v0.6">,
//         altoBundlerV06,
//         verifyingPaymasterV06,
//         walletClient,
//         true
//       );
//     }

//     throw new RpcError(
//       "EntryPoint not supported",
//       ValidationErrors.InvalidFields
//     );
//   }

//   if (parsedBody.method === "pm_getPaymasterStubData") {
//     const params = pmGetPaymasterStubDataParamsSchema.safeParse(
//       parsedBody.params
//     );

//     if (!params.success) {
//       throw new RpcError(
//         fromZodError(params.error).message,
//         ValidationErrors.InvalidFields
//       );
//     }

//     const [, entryPoint] = params.data;

//     if (entryPoint === ENTRYPOINT_ADDRESS_V07) {
//       // Create a clean placeholder with proper length
//       const validUntil = 0;
//       const validAfter = 0;
//       const placeholderData = concat([
//         encodeAbiParameters(
//           [
//             { name: "validUntil", type: "uint48" },
//             { name: "validAfter", type: "uint48" },
//           ],
//           [validUntil, validAfter]
//         ),
//         toHex(0, { size: 65 }), // Empty signature placeholder
//       ]);
      
//       return {
//         paymaster: verifyingPaymasterV07.address,
//         paymasterData: placeholderData,
//         paymasterVerificationGasLimit: toHex(50_000n),
//         paymasterPostOpGasLimit: toHex(20_000n),
//       };
//     }

//     if (entryPoint === ENTRYPOINT_ADDRESS_V06) {
//       return {
//         paymasterAndData: `${verifyingPaymasterV06.address}00000000000000000000000000000000000000000000000000000101010101010000000000000000000000000000000000000000000000000000000000000000cd91f19f0f19ce862d7bec7b7d9b95457145afc6f639c28fd0360f488937bfa41e6eedcd3a46054fd95fcd0e3ef6b0bc0a615c4d975eef55c8a3517257904d5b1c`,
//       };
//     }

//     throw new RpcError(
//       "EntryPoint not supported",
//       ValidationErrors.InvalidFields
//     );
//   }

//   if (parsedBody.method === "pm_getPaymasterData") {
//     const params = pmGetPaymasterData.safeParse(parsedBody.params);

//     if (!params.success) {
//       throw new RpcError(
//         fromZodError(params.error).message,
//         ValidationErrors.InvalidFields
//       );
//     }

//     const [userOperation, entryPoint] = params.data;

//     if (entryPoint === ENTRYPOINT_ADDRESS_V07) {
//       return await handleMethodV07(
//         userOperation as UserOperation<"v0.7">,
//         altoBundlerV07,
//         verifyingPaymasterV07,
//         walletClient,
//         false
//       );
//     }

//     if (entryPoint === ENTRYPOINT_ADDRESS_V06) {
//       return await handleMethodV06(
//         userOperation as UserOperation<"v0.6">,
//         altoBundlerV06,
//         verifyingPaymasterV06,
//         walletClient,
//         false
//       );
//     }

//     throw new RpcError(
//       "EntryPoint not supported",
//       ValidationErrors.InvalidFields
//     );
//   }

//   if (parsedBody.method === "pm_validateSponsorshipPolicies") {
//     return [
//       {
//         sponsorshipPolicyId: "sp_crazy_kangaroo",
//         data: {
//           name: "Free ops for devs",
//           author: "foo",
//           icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
//           description: "Free userOps :)",
//         },
//       },
//     ];
//   }

//   throw new RpcError(
//     "Attempted to call an unknown method",
//     ValidationErrors.InvalidFields
//   );
// };

// export const createRpcHandler = (
//   altoBundlerV07: PimlicoBundlerClient<ENTRYPOINT_ADDRESS_V07_TYPE>,
//   altoBundlerV06: PimlicoBundlerClient<ENTRYPOINT_ADDRESS_V06_TYPE>,
//   verifyingPaymasterV07: GetContractReturnType<
//     typeof VERIFYING_PAYMASTER_V07_ABI,
//     PublicClient<Transport, Chain>
//   >,
//   verifyingPaymasterV06: GetContractReturnType<
//     typeof VERIFYING_PAYMASTER_V06_ABI,
//     PublicClient<Transport, Chain>
//   >,
//   walletClient: WalletClient<Transport, Chain, Account>
// ) => {
//   return async (request: FastifyRequest, _reply: FastifyReply) => {
//     const body = request.body;
//     const parsedBody = jsonRpcSchema.safeParse(body);
//     if (!parsedBody.success) {
//       throw new RpcError(
//         fromZodError(parsedBody.error).message,
//         ValidationErrors.InvalidFields
//       );
//     }

//     try {
//       const result = await handleMethod(
//         altoBundlerV07,
//         altoBundlerV06,
//         verifyingPaymasterV07,
//         verifyingPaymasterV06,
//         walletClient,
//         parsedBody.data
//       );

//       return {
//         jsonrpc: "2.0",
//         id: parsedBody.data.id,
//         result,
//       };
//     } catch (err: unknown) {
//       console.log(`JSON.stringify(err): ${util.inspect(err)}`);

//       const error = {
//         // biome-ignore lint/suspicious/noExplicitAny:
//         message: (err as any).message,
//         // biome-ignore lint/suspicious/noExplicitAny:
//         data: (err as any).data,
//         // biome-ignore lint/suspicious/noExplicitAny:
//         code: (err as any).code ?? -32603,
//       };

//       return {
//         jsonrpc: "2.0",
//         id: parsedBody.data.id,
//         error,
//       };
//     }
//   };
// };

// SBC methods

/**
 * Generate EIP712 signature for paymaster data
 */
const generatePaymasterSignature = async (
  walletClient: WalletClient<Transport, Chain, Account>,
  paymasterAddress: Hex,
  validUntil: number,
  validAfter: number,
  senderAddress: Hex,
  nonce: bigint,
  calldataHash: Hex
): Promise<Hex> => {
  const chainId = await walletClient.getChainId();
  
  return await walletClient.signTypedData({
    domain: {
      name: "SignatureVerifyingPaymaster",
      version: PAYMASTER_VERSION,
      chainId: chainId,
      verifyingContract: paymasterAddress
    },
    types: {
      PaymasterData: [
        { name: "validUntil", type: "uint48" },
        { name: "validAfter", type: "uint48" },
        { name: "sender", type: "address" },
        { name: "nonce", type: "uint256" },
        { name: "calldataHash", type: "bytes32" }
      ]
    },
    primaryType: "PaymasterData",
    message: {
      validUntil: validUntil,
      validAfter: validAfter,
      sender: senderAddress,
      nonce: nonce,
      calldataHash: calldataHash
    }
  });
};

/**
 * Create paymaster data by combining timestamps and signature
 * @param validUntil The timestamp until which the signature is valid
 * @param validAfter The timestamp after which the signature is valid
 * @param signature The EIP712 signature
 * @returns The formatted paymaster data
 */
const createPaymasterData = (
  validUntil: number,
  validAfter: number,
  signature: Hex
): Hex => {
  const validUntilHex = validUntil.toString(16).padStart(12, '0');
  const validAfterHex = validAfter.toString(16).padStart(12, '0');
  return `0x${validUntilHex}${validAfterHex}${signature.slice(2)}` as Hex;
};

const handleSbcMethodV07 = async (
  userOperation: UserOperation<"v0.7">,
  altoBundlerV07: PimlicoBundlerClient<ENTRYPOINT_ADDRESS_V07_TYPE>,
  paymasterV07: GetContractReturnType<
    typeof PaymasterV07Abi,
    PublicClient<Transport, Chain>
  >,
  walletClient: WalletClient<Transport, Chain, Account>,
  estimateGas: boolean
) => {
  try {
    // Set timestamps for validation window
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const validAfter = currentTimestamp - 10; // 10 seconds before current time for more generous testing buffer
    const validUntil = currentTimestamp + 3600; // 1 hour validity
    
    const senderAddress = userOperation.sender;

    const calldataHash = keccak256(hexToBytes(userOperation.callData));
    
    // Sign using EIP712 structured signing that matches the contract exactly
    const signature = await generatePaymasterSignature(
      walletClient,
      paymasterV07.address,
      validUntil,
      validAfter,
      senderAddress,
      userOperation.nonce,
      calldataHash
    );
    
    // Construct paymasterData
    const paymasterData = createPaymasterData(validUntil, validAfter, signature);
    
    if (estimateGas) {
      // For gas estimation
      let op = {
        ...userOperation,
        paymaster: paymasterV07.address,
        paymasterData: paymasterData
      };
      
      console.log("🔧 Final User Operation for gas estimation:");
      console.log("  paymaster:", op.paymaster);
      console.log("  paymasterData:", op.paymasterData);
      console.log("  paymasterData length:", op.paymasterData.length);
      
      let gasEstimates: EstimateUserOperationGasReturnType<ENTRYPOINT_ADDRESS_V07_TYPE>;
      try {
        gasEstimates = await altoBundlerV07.estimateUserOperationGas({
          userOperation: op,
        });
      } catch (e) {
        console.error("Gas estimation error:", e);
        if (!(e instanceof BaseError)) throw new InternalBundlerError();
        throw e.walk() as RpcRequestError;
      }
      
      return {
        preVerificationGas: toHex(gasEstimates.preVerificationGas),
        callGasLimit: toHex(gasEstimates.callGasLimit),
        paymasterVerificationGasLimit: toHex(gasEstimates.paymasterVerificationGasLimit || 100_000n),
        paymasterPostOpGasLimit: toHex(gasEstimates.paymasterPostOpGasLimit || 50_000n),
        verificationGasLimit: toHex(gasEstimates.verificationGasLimit),
        paymaster: paymasterV07.address,
        paymasterData: paymasterData,
      };
    } else {
      // Return with default gas limits
      const callGasLimit = userOperation.callGasLimit || 500_000n;
      const verificationGasLimit = userOperation.verificationGasLimit || 500_000n;
      const preVerificationGas = userOperation.preVerificationGas || 100_000n;
      const paymasterVerificationGasLimit = userOperation.paymasterVerificationGasLimit || 100_000n;
      const paymasterPostOpGasLimit = userOperation.paymasterPostOpGasLimit || 50_000n;
    
      return {
        preVerificationGas: toHex(preVerificationGas),
        callGasLimit: toHex(callGasLimit),
        paymasterVerificationGasLimit: toHex(paymasterVerificationGasLimit),
        paymasterPostOpGasLimit: toHex(paymasterPostOpGasLimit),
        verificationGasLimit: toHex(verificationGasLimit),
        paymaster: paymasterV07.address,
        paymasterData: paymasterData,
      };
    }
  } catch (error) {
    console.error("Critical error during paymaster signing:", error);
    throw error;
  }
};

const handleSbcMethod = async (
  altoBundlerV07: PimlicoBundlerClient<ENTRYPOINT_ADDRESS_V07_TYPE>,
  paymasterV07: GetContractReturnType<
    typeof PaymasterV07Abi,
    PublicClient<Transport, Chain>
  >,
  walletClient: WalletClient<Transport, Chain, Account>,
  parsedBody: JsonRpcSchema
) => {
  if (parsedBody.method === "pm_getPaymasterStubData") {
    const params = pmGetPaymasterStubDataParamsSchema.safeParse(parsedBody.params);

    if (!params.success) {
      throw new RpcError(
        fromZodError(params.error).message,
        ValidationErrors.InvalidFields
      );
    }

    const [userOperation, _] = params.data;
    console.log("userOperation SENDER", userOperation.sender);

    try {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const validAfter = currentTimestamp - 10; // 10 seconds before current time for more generous testing buffer
      const validUntil = currentTimestamp + 3600; // 1 hour validity
      
      const senderAddress = userOperation.sender;
      const calldataHash = keccak256(hexToBytes(userOperation.callData));
      
      const signature = await generatePaymasterSignature(
        walletClient,
        paymasterV07.address,
        validUntil,
        validAfter,
        senderAddress,
        userOperation.nonce,
        calldataHash
      );

      const paymasterData = createPaymasterData(validUntil, validAfter, signature);
      
      return {
        paymasterData: paymasterData,
        paymasterVerificationGasLimit: toHex(100_000n),
        paymasterPostOpGasLimit: toHex(50_000n),
        paymaster: paymasterV07.address
      };
    } catch (error) {
      console.error("Critical error during paymaster stub data generation:", error);
      throw error;
    }
  }
  
  if (parsedBody.method === "pm_getPaymasterData") {
    const params = pmGetPaymasterData.safeParse(parsedBody.params);

    if (!params.success) {
      throw new RpcError(
        fromZodError(params.error).message,
        ValidationErrors.InvalidFields
      );
    }

    const [userOperation, entryPoint] = params.data;

    if (entryPoint === ENTRYPOINT_ADDRESS_V07) {
      console.log("Handling pm_getPaymasterData for v0.7 entrypoint");
      return await handleSbcMethodV07(
        userOperation as UserOperation<"v0.7">,
        altoBundlerV07,
        paymasterV07,
        walletClient,
        false
      );
    }

    throw new RpcError(
      "EntryPoint not supported",
      ValidationErrors.InvalidFields
    );
  }

  if (parsedBody.method === "pm_sponsorUserOperation") {
    const params = pmSponsorUserOperationParamsSchema.safeParse(
      parsedBody.params
    );

    if (!params.success) {
      throw new RpcError(
        fromZodError(params.error).message,
        ValidationErrors.InvalidFields
      );
    }

    const [userOperation, entryPoint] = params.data;

    if (entryPoint === ENTRYPOINT_ADDRESS_V07) {
      console.log("Handling pm_sponsorUserOperation for v0.7 entrypoint");
      return await handleSbcMethodV07(
        userOperation as UserOperation<"v0.7">,
        altoBundlerV07,
        paymasterV07,
        walletClient,
        true
      );
    }

    throw new RpcError(
      "EntryPoint not supported",
      ValidationErrors.InvalidFields
    );
  }

  throw new RpcError(
    "Attempted to call an unknown method",
    ValidationErrors.InvalidFields
  );
};

export const createSbcRpcHandler = (
  altoBundlerV07: PimlicoBundlerClient<ENTRYPOINT_ADDRESS_V07_TYPE>,
  paymasterV07: GetContractReturnType<
    typeof PaymasterV07Abi,
    PublicClient<Transport, Chain>
  >,
  walletClient: WalletClient<Transport, Chain, Account>
) => {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    const body = request.body;
    const parsedBody = jsonRpcSchema.safeParse(body);
    if (!parsedBody.success) {
      throw new RpcError(
        fromZodError(parsedBody.error).message,
        ValidationErrors.InvalidFields
      );
    }

    try {
      const result = await handleSbcMethod(
        altoBundlerV07,
        paymasterV07,
        walletClient,
        parsedBody.data
      );

      return {
        jsonrpc: "2.0",
        id: parsedBody.data.id,
        result,
      };
    } catch (err: unknown) {
      console.log(`JSON.stringify(err): ${util.inspect(err)}`);

      const error = {
        // biome-ignore lint/suspicious/noExplicitAny:
        message: (err as any).message,
        // biome-ignore lint/suspicious/noExplicitAny:
        data: (err as any).data,
        // biome-ignore lint/suspicious/noExplicitAny:
        code: (err as any).code ?? -32603,
      };

      return {
        jsonrpc: "2.0",
        id: parsedBody.data.id,
        error,
      };
    }
  };
};
