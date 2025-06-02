# mock-app

This is a mock app demonstrating how to send user operations using a signature-verifying paymaster for gas sponsorship. The app mints a `SampleNFT` and verifies successful minting.

## Features

- **Smart Account Integration**: Uses ERC-4337 Account Abstraction for gasless transactions
- **Paymaster Sponsorship**: Leverages `SignatureVerifyingPaymasterV07` for gas payment
- **NFT Minting**: Demonstrates minting and ownership verification
- **Real-time Updates**: Shows transaction progress and confirmation

## Architecture

The app interacts with:
- **SampleNFT Contract**: ERC-721 NFT contract for minting
- **SignatureVerifyingPaymasterV07**: EIP712-based paymaster that validates signatures before sponsoring transactions
- **EntryPoint v0.7**: ERC-4337 entry point for user operation execution
- **Smart Account**: User's smart contract wallet

## Key Components

You can find the smart contracts in the `mock-verifying-paymaster/contracts` directory:
- `SampleNFT.sol`: ERC-721 NFT contract
- `SignatureVerifyingPaymasterV07.sol`: Signature-verifying paymaster

The NFT's ABI in `mock-app/src/abi.ts` is generated from the compiled contract artifacts.

## Important Notes

- The paymaster validates EIP712 signatures before approving gas sponsorship (not "approve all")
- The app checks ownership of token ID `1` after minting (the first minted token)
