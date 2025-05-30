/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { Paymaster, PaymasterInterface } from "../../contracts/Paymaster";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "enum IPaymaster.PostOpMode",
        name: "mode",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "context",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "actualGasCost",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "actualUserOpFeePerGas",
        type: "uint256",
      },
    ],
    name: "postOp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "initCode",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
          {
            internalType: "bytes32",
            name: "accountGasLimits",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "preVerificationGas",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "gasFees",
            type: "bytes32",
          },
          {
            internalType: "bytes",
            name: "paymasterAndData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct PackedUserOperation",
        name: "",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "validatePaymasterUserOp",
    outputs: [
      {
        internalType: "bytes",
        name: "context",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "validationData",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50610206806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806352b7512c1461003b5780637c627b2114610078575b600080fd5b61006161004936600461008f565b50506040805160008082526020820190925292909150565b60405161006f9291906100e3565b60405180910390f35b61008d610086366004610138565b5050505050565b005b6000806000606084860312156100a457600080fd5b833567ffffffffffffffff8111156100bb57600080fd5b840161012081870312156100ce57600080fd5b95602085013595506040909401359392505050565b604081526000835180604084015260005b8181101561011157602081870181015160608684010152016100f4565b506000606082850101526060601f19601f8301168401019150508260208301529392505050565b60008060008060006080868803121561015057600080fd5b85356003811061015f57600080fd5b9450602086013567ffffffffffffffff8082111561017c57600080fd5b818801915088601f83011261019057600080fd5b81358181111561019f57600080fd5b8960208285010111156101b157600080fd5b969960209290920198509596604081013596506060013594509250505056fea26469706673582212206916f5a412241b5db5a97d03edcf1cfe91cc1a80c53a81487aeafadb4cf9dd4064736f6c63430008170033";

type PaymasterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PaymasterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Paymaster__factory extends ContractFactory {
  constructor(...args: PaymasterConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      Paymaster & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Paymaster__factory {
    return super.connect(runner) as Paymaster__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PaymasterInterface {
    return new Interface(_abi) as PaymasterInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Paymaster {
    return new Contract(address, _abi, runner) as unknown as Paymaster;
  }
}
