# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2025-01-14

### Fixed

#### AA34 Signature Error Resolution
- **Fixed EIP712 domain mismatch**: Corrected domain name from `"SignatureVerifyingPaymasterV07"` to `"SignatureVerifyingPaymaster"` to match contract implementation
- **Fixed EIP712 version mismatch**: Updated version from `"1"` to `"4"` to match contract's `DOMAIN_VERSION`
- **Fixed EIP712 type structure**: Corrected field names from `paymasterAddress`/`senderAddress` to `paymaster`/`sender` to match contract's `PAYMASTER_DATA_TYPEHASH`
- **Fixed signature recovery incompatibility**: Switched from `signMessage` to `signTypedData` for proper EIP712 structured signing compatible with contract's `ECDSA.recover`

#### Timing Issues
- **Fixed validAfter timing race conditions**: Increased buffer from 1 second to 10 seconds before current timestamp for testing environments
- **Resolved "not valid yet" errors**: Addressed timing precision issues between signature generation and validation

#### Code Quality Improvements
- **Extracted reusable signature function**: Created `generatePaymasterSignature()` to eliminate code duplication
- **Made version configurable**: Added `PAYMASTER_VERSION` constant and version parameter for easier maintenance
- **Improved TypeScript types**: Added proper `Hex` typing for addresses and signatures
- **Cleaned up debugging code**: Removed extensive debug logging for production readiness

#### Application Fixes
- **Fixed NFT ownership query**: Corrected token ID from `0` to `1` in `mock-app` to match actual minted token ID
- **Added delay for ownership check**: Implemented 1-second delay to ensure transaction confirmation before querying

### Technical Details

#### EIP712 Signature Structure
The paymaster now correctly implements EIP712 signatures with:
```
Domain: {
  name: "SignatureVerifyingPaymaster",
  version: "4", 
  chainId: 31337,
  verifyingContract: <paymaster_address>
}

Types: {
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

#### Timestamp Encoding
- `validUntil`: 6-byte big-endian encoding (uint48)
- `validAfter`: 6-byte big-endian encoding (uint48) 
- Both timestamps use proper hex padding with `toString(16).padStart(12, '0')`

#### PaymasterData Format
```
0x + validUntil(12 hex chars) + validAfter(12 hex chars) + signature(130 hex chars)
Total length: 156 characters (including 0x prefix)
```

### Breaking Changes
- Paymaster now requires proper EIP712 signatures (no longer "approve all")
- Client implementations must use exact EIP712 domain and type structure
- Invalid or missing signatures will result in AA34 errors

### Migration Guide
For existing implementations:
1. Update EIP712 domain name to `"SignatureVerifyingPaymaster"`
2. Update EIP712 version to `"4"`
3. Use field names `paymaster` and `sender` (not `paymasterAddress`/`senderAddress`)
4. Ensure `signTypedData` is used instead of `signMessage`
5. Set `validAfter` to `currentTimestamp - 10` for testing environments
