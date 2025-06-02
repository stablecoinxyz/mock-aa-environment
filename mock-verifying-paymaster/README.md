# SignatureVerifyingPaymasterV07

A secure EIP712-based paymaster implementation for ERC-4337 v0.7 that validates signatures before sponsoring user operations.

## Overview

This paymaster uses EIP712 structured signing to verify that user operations have been approved by a trusted signer before paying for gas. Each signature is tied to specific transaction data to prevent replay attacks.

## Architecture

### Smart Contract (`SignatureVerifyingPaymasterV07.sol`)
- Inherits from `BasePaymaster` and implements EIP712 domain separation
- Validates signatures using `ECDSA.recover` against a configured `verifyingSigner`
- Supports temporal validation with `validAfter` and `validUntil` timestamps
- Includes nonce and calldata hash in signatures to prevent replay attacks

### Paymaster Service (`src/relay.ts`)
- Implements JSON-RPC interface for paymaster operations
- Generates EIP712 signatures for user operations
- Supports `pm_getPaymasterStubData`, `pm_getPaymasterData`, and `pm_sponsorUserOperation`

## EIP712 Implementation

### Domain
```javascript
{
  name: "SignatureVerifyingPaymaster",
  version: "4",
  chainId: 31337,
  verifyingContract: "<paymaster_address>"
}
```

### Type Structure
```javascript
{
  PaymasterData: [
    { name: "validUntil", type: "uint48" },
    { name: "validAfter", type: "uint48" },
    { name: "chainId", type: "uint256" },
    { name: "paymaster", type: "address" },
    { name: "sender", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "calldataHash", type: "bytes32" }
  ]
}
```

## PaymasterData Format

The paymaster data is encoded as raw bytes:
```
validUntil (6 bytes) + validAfter (6 bytes) + signature (65 bytes) = 77 bytes total
```

### Timestamp Encoding
- Timestamps are encoded as uint48 (6 bytes) in big-endian format
- Use `toString(16).padStart(12, '0')` for proper hex encoding

### Example
```
0x0000683d1e3b0000683d102a + <65-byte-signature>
```

## API Endpoints

### `pm_getPaymasterStubData`
Returns stub paymaster data for gas estimation.

### `pm_getPaymasterData` 
Returns signed paymaster data for actual transaction execution.

### `pm_sponsorUserOperation`
Returns sponsored user operation with gas estimates and paymaster data.

## Configuration

### Environment Variables
- `PAYMASTER_VERSION`: EIP712 domain version (default: "4")
- Signer private key is configured during contract deployment

### Timing Configuration
- `validAfter`: Set to `currentTimestamp - 10` for testing (10-second buffer)
- `validUntil`: Set to `currentTimestamp + 3600` (1-hour validity)

## Security Features

1. **EIP712 Structured Signing**: Prevents signature malleability
2. **Domain Separation**: Prevents cross-contract signature reuse
3. **Nonce Protection**: Prevents transaction replay attacks
4. **Calldata Binding**: Signatures are tied to specific transaction data
5. **Temporal Validation**: Time-bounded signature validity
6. **Chain ID Binding**: Prevents cross-chain signature reuse

## Usage Example

```javascript
const signature = await generatePaymasterSignature(
  walletClient,
  paymasterAddress,
  "4", // version
  validUntil,
  validAfter,
  senderAddress,
  nonce,
  calldataHash
);
```

## Troubleshooting

### AA34 Signature Errors
- Verify EIP712 domain matches exactly: name="SignatureVerifyingPaymaster", version="4"
- Ensure field names are `paymaster` and `sender` (not `paymasterAddress`/`senderAddress`)
- Use `signTypedData` instead of `signMessage`
- Check that signer address matches contract's `verifyingSigner`

### Timing Errors
- Increase `validAfter` buffer for testing environments
- Ensure timestamps are properly encoded as uint48

### Gas Estimation Failures
- Verify paymaster has sufficient funds in EntryPoint
- Check that user operation format matches ERC-4337 v0.7 specification
