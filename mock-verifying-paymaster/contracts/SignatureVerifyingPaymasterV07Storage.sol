// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@account-abstraction/contracts/interfaces/IEntryPoint.sol";

/**
 * @title SignatureVerifyingPaymasterV07Storage
 * @dev Storage contract for SignatureVerifyingPaymasterV07
 * This contract holds all storage variables to avoid storage collisions in upgrades
 */
abstract contract SignatureVerifyingPaymasterV07Storage is Initializable {
    // Address authorized to sign paymaster approvals
    address public verifyingSigner;

    // Gap for future storage variables
    uint256[48] private __gap;
} 