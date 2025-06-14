/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export type PackedUserOperationStruct = {
  sender: AddressLike;
  nonce: BigNumberish;
  initCode: BytesLike;
  callData: BytesLike;
  accountGasLimits: BytesLike;
  preVerificationGas: BigNumberish;
  gasFees: BytesLike;
  paymasterAndData: BytesLike;
  signature: BytesLike;
};

export type PackedUserOperationStructOutput = [
  sender: string,
  nonce: bigint,
  initCode: string,
  callData: string,
  accountGasLimits: string,
  preVerificationGas: bigint,
  gasFees: string,
  paymasterAndData: string,
  signature: string
] & {
  sender: string;
  nonce: bigint;
  initCode: string;
  callData: string;
  accountGasLimits: string;
  preVerificationGas: bigint;
  gasFees: string;
  paymasterAndData: string;
  signature: string;
};

export interface SignatureVerifyingPaymasterV07Interface extends Interface {
  getFunction(
    nameOrSignature:
      | "UPGRADE_INTERFACE_VERSION"
      | "VERSION"
      | "addStake"
      | "deposit"
      | "domainSeparator"
      | "eip712Domain"
      | "entryPoint"
      | "getDeposit"
      | "getHash"
      | "initialize"
      | "maxAllowedGasCost"
      | "owner"
      | "postOp"
      | "proxiableUUID"
      | "reinitializeEIP712"
      | "renounceOwnership"
      | "setMaxAllowedGasCost"
      | "setVerifyingSigner"
      | "transferOwnership"
      | "unlockStake"
      | "upgradeToAndCall"
      | "validatePaymasterUserOp"
      | "verifyingSigner"
      | "withdrawStake"
      | "withdrawTo"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "EIP712DomainChanged"
      | "EntryPointChanged"
      | "Initialized"
      | "MaxAllowedGasCostUpdated"
      | "OwnershipTransferred"
      | "Upgraded"
      | "Validated"
      | "VerifyingSignerUpdated"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "UPGRADE_INTERFACE_VERSION",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "VERSION", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "addStake",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "deposit", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "domainSeparator",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "eip712Domain",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "entryPoint",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getDeposit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getHash",
    values: [BigNumberish, BigNumberish, AddressLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "maxAllowedGasCost",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "postOp",
    values: [BigNumberish, BytesLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "proxiableUUID",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "reinitializeEIP712",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxAllowedGasCost",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setVerifyingSigner",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "unlockStake",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeToAndCall",
    values: [AddressLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "validatePaymasterUserOp",
    values: [PackedUserOperationStruct, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "verifyingSigner",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawStake",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawTo",
    values: [AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "UPGRADE_INTERFACE_VERSION",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "VERSION", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "addStake", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "domainSeparator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "eip712Domain",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "entryPoint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getDeposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getHash", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "maxAllowedGasCost",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "postOp", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "proxiableUUID",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "reinitializeEIP712",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxAllowedGasCost",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setVerifyingSigner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unlockStake",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "upgradeToAndCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validatePaymasterUserOp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "verifyingSigner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawStake",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdrawTo", data: BytesLike): Result;
}

export namespace EIP712DomainChangedEvent {
  export type InputTuple = [];
  export type OutputTuple = [];
  export interface OutputObject {}
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace EntryPointChangedEvent {
  export type InputTuple = [newEntryPoint: AddressLike];
  export type OutputTuple = [newEntryPoint: string];
  export interface OutputObject {
    newEntryPoint: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace InitializedEvent {
  export type InputTuple = [version: BigNumberish];
  export type OutputTuple = [version: bigint];
  export interface OutputObject {
    version: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MaxAllowedGasCostUpdatedEvent {
  export type InputTuple = [oldLimit: BigNumberish, newLimit: BigNumberish];
  export type OutputTuple = [oldLimit: bigint, newLimit: bigint];
  export interface OutputObject {
    oldLimit: bigint;
    newLimit: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UpgradedEvent {
  export type InputTuple = [implementation: AddressLike];
  export type OutputTuple = [implementation: string];
  export interface OutputObject {
    implementation: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ValidatedEvent {
  export type InputTuple = [
    userOpHash: BytesLike,
    maxCost: BigNumberish,
    validUntil: BigNumberish,
    validAfter: BigNumberish
  ];
  export type OutputTuple = [
    userOpHash: string,
    maxCost: bigint,
    validUntil: bigint,
    validAfter: bigint
  ];
  export interface OutputObject {
    userOpHash: string;
    maxCost: bigint;
    validUntil: bigint;
    validAfter: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace VerifyingSignerUpdatedEvent {
  export type InputTuple = [oldSigner: AddressLike, newSigner: AddressLike];
  export type OutputTuple = [oldSigner: string, newSigner: string];
  export interface OutputObject {
    oldSigner: string;
    newSigner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface SignatureVerifyingPaymasterV07 extends BaseContract {
  connect(runner?: ContractRunner | null): SignatureVerifyingPaymasterV07;
  waitForDeployment(): Promise<this>;

  interface: SignatureVerifyingPaymasterV07Interface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  UPGRADE_INTERFACE_VERSION: TypedContractMethod<[], [string], "view">;

  VERSION: TypedContractMethod<[], [bigint], "view">;

  addStake: TypedContractMethod<
    [unstakeDelaySec: BigNumberish],
    [void],
    "payable"
  >;

  deposit: TypedContractMethod<[], [void], "payable">;

  domainSeparator: TypedContractMethod<[], [string], "view">;

  eip712Domain: TypedContractMethod<
    [],
    [
      [string, string, string, bigint, string, string, bigint[]] & {
        fields: string;
        name: string;
        version: string;
        chainId: bigint;
        verifyingContract: string;
        salt: string;
        extensions: bigint[];
      }
    ],
    "view"
  >;

  entryPoint: TypedContractMethod<[], [string], "view">;

  getDeposit: TypedContractMethod<[], [bigint], "view">;

  getHash: TypedContractMethod<
    [
      validUntil: BigNumberish,
      validAfter: BigNumberish,
      sender: AddressLike,
      nonce: BigNumberish,
      calldataHash: BytesLike
    ],
    [string],
    "view"
  >;

  initialize: TypedContractMethod<
    [_verifyingSigner: AddressLike, _owner: AddressLike],
    [void],
    "nonpayable"
  >;

  maxAllowedGasCost: TypedContractMethod<[], [bigint], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  postOp: TypedContractMethod<
    [
      mode: BigNumberish,
      context: BytesLike,
      actualGasCost: BigNumberish,
      actualUserOpFeePerGas: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  proxiableUUID: TypedContractMethod<[], [string], "view">;

  reinitializeEIP712: TypedContractMethod<[], [void], "nonpayable">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  setMaxAllowedGasCost: TypedContractMethod<
    [_maxAllowedGasCost: BigNumberish],
    [void],
    "nonpayable"
  >;

  setVerifyingSigner: TypedContractMethod<
    [_verifyingSigner: AddressLike],
    [void],
    "nonpayable"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  unlockStake: TypedContractMethod<[], [void], "nonpayable">;

  upgradeToAndCall: TypedContractMethod<
    [newImplementation: AddressLike, data: BytesLike],
    [void],
    "payable"
  >;

  validatePaymasterUserOp: TypedContractMethod<
    [
      userOp: PackedUserOperationStruct,
      userOpHash: BytesLike,
      maxCost: BigNumberish
    ],
    [[string, bigint] & { context: string; validationData: bigint }],
    "nonpayable"
  >;

  verifyingSigner: TypedContractMethod<[], [string], "view">;

  withdrawStake: TypedContractMethod<
    [withdrawAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  withdrawTo: TypedContractMethod<
    [withdrawAddress: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "UPGRADE_INTERFACE_VERSION"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "VERSION"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "addStake"
  ): TypedContractMethod<[unstakeDelaySec: BigNumberish], [void], "payable">;
  getFunction(
    nameOrSignature: "deposit"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "domainSeparator"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "eip712Domain"
  ): TypedContractMethod<
    [],
    [
      [string, string, string, bigint, string, string, bigint[]] & {
        fields: string;
        name: string;
        version: string;
        chainId: bigint;
        verifyingContract: string;
        salt: string;
        extensions: bigint[];
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "entryPoint"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getDeposit"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getHash"
  ): TypedContractMethod<
    [
      validUntil: BigNumberish,
      validAfter: BigNumberish,
      sender: AddressLike,
      nonce: BigNumberish,
      calldataHash: BytesLike
    ],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "initialize"
  ): TypedContractMethod<
    [_verifyingSigner: AddressLike, _owner: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "maxAllowedGasCost"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "postOp"
  ): TypedContractMethod<
    [
      mode: BigNumberish,
      context: BytesLike,
      actualGasCost: BigNumberish,
      actualUserOpFeePerGas: BigNumberish
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "proxiableUUID"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "reinitializeEIP712"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setMaxAllowedGasCost"
  ): TypedContractMethod<
    [_maxAllowedGasCost: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setVerifyingSigner"
  ): TypedContractMethod<[_verifyingSigner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "unlockStake"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "upgradeToAndCall"
  ): TypedContractMethod<
    [newImplementation: AddressLike, data: BytesLike],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "validatePaymasterUserOp"
  ): TypedContractMethod<
    [
      userOp: PackedUserOperationStruct,
      userOpHash: BytesLike,
      maxCost: BigNumberish
    ],
    [[string, bigint] & { context: string; validationData: bigint }],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "verifyingSigner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "withdrawStake"
  ): TypedContractMethod<[withdrawAddress: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawTo"
  ): TypedContractMethod<
    [withdrawAddress: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "EIP712DomainChanged"
  ): TypedContractEvent<
    EIP712DomainChangedEvent.InputTuple,
    EIP712DomainChangedEvent.OutputTuple,
    EIP712DomainChangedEvent.OutputObject
  >;
  getEvent(
    key: "EntryPointChanged"
  ): TypedContractEvent<
    EntryPointChangedEvent.InputTuple,
    EntryPointChangedEvent.OutputTuple,
    EntryPointChangedEvent.OutputObject
  >;
  getEvent(
    key: "Initialized"
  ): TypedContractEvent<
    InitializedEvent.InputTuple,
    InitializedEvent.OutputTuple,
    InitializedEvent.OutputObject
  >;
  getEvent(
    key: "MaxAllowedGasCostUpdated"
  ): TypedContractEvent<
    MaxAllowedGasCostUpdatedEvent.InputTuple,
    MaxAllowedGasCostUpdatedEvent.OutputTuple,
    MaxAllowedGasCostUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "Upgraded"
  ): TypedContractEvent<
    UpgradedEvent.InputTuple,
    UpgradedEvent.OutputTuple,
    UpgradedEvent.OutputObject
  >;
  getEvent(
    key: "Validated"
  ): TypedContractEvent<
    ValidatedEvent.InputTuple,
    ValidatedEvent.OutputTuple,
    ValidatedEvent.OutputObject
  >;
  getEvent(
    key: "VerifyingSignerUpdated"
  ): TypedContractEvent<
    VerifyingSignerUpdatedEvent.InputTuple,
    VerifyingSignerUpdatedEvent.OutputTuple,
    VerifyingSignerUpdatedEvent.OutputObject
  >;

  filters: {
    "EIP712DomainChanged()": TypedContractEvent<
      EIP712DomainChangedEvent.InputTuple,
      EIP712DomainChangedEvent.OutputTuple,
      EIP712DomainChangedEvent.OutputObject
    >;
    EIP712DomainChanged: TypedContractEvent<
      EIP712DomainChangedEvent.InputTuple,
      EIP712DomainChangedEvent.OutputTuple,
      EIP712DomainChangedEvent.OutputObject
    >;

    "EntryPointChanged(address)": TypedContractEvent<
      EntryPointChangedEvent.InputTuple,
      EntryPointChangedEvent.OutputTuple,
      EntryPointChangedEvent.OutputObject
    >;
    EntryPointChanged: TypedContractEvent<
      EntryPointChangedEvent.InputTuple,
      EntryPointChangedEvent.OutputTuple,
      EntryPointChangedEvent.OutputObject
    >;

    "Initialized(uint64)": TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;
    Initialized: TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;

    "MaxAllowedGasCostUpdated(uint256,uint256)": TypedContractEvent<
      MaxAllowedGasCostUpdatedEvent.InputTuple,
      MaxAllowedGasCostUpdatedEvent.OutputTuple,
      MaxAllowedGasCostUpdatedEvent.OutputObject
    >;
    MaxAllowedGasCostUpdated: TypedContractEvent<
      MaxAllowedGasCostUpdatedEvent.InputTuple,
      MaxAllowedGasCostUpdatedEvent.OutputTuple,
      MaxAllowedGasCostUpdatedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "Upgraded(address)": TypedContractEvent<
      UpgradedEvent.InputTuple,
      UpgradedEvent.OutputTuple,
      UpgradedEvent.OutputObject
    >;
    Upgraded: TypedContractEvent<
      UpgradedEvent.InputTuple,
      UpgradedEvent.OutputTuple,
      UpgradedEvent.OutputObject
    >;

    "Validated(bytes32,uint256,uint48,uint48)": TypedContractEvent<
      ValidatedEvent.InputTuple,
      ValidatedEvent.OutputTuple,
      ValidatedEvent.OutputObject
    >;
    Validated: TypedContractEvent<
      ValidatedEvent.InputTuple,
      ValidatedEvent.OutputTuple,
      ValidatedEvent.OutputObject
    >;

    "VerifyingSignerUpdated(address,address)": TypedContractEvent<
      VerifyingSignerUpdatedEvent.InputTuple,
      VerifyingSignerUpdatedEvent.OutputTuple,
      VerifyingSignerUpdatedEvent.OutputObject
    >;
    VerifyingSignerUpdated: TypedContractEvent<
      VerifyingSignerUpdatedEvent.InputTuple,
      VerifyingSignerUpdatedEvent.OutputTuple,
      VerifyingSignerUpdatedEvent.OutputObject
    >;
  };
}
