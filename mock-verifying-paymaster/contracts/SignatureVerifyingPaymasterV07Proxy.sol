// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

/**
 * @title SignatureVerifyingPaymasterV07Proxy
 * @dev Proxy contract for SignatureVerifyingPaymasterV07
 * Uses OpenZeppelin's TransparentUpgradeableProxy for secure upgradeability
 */
contract SignatureVerifyingPaymasterV07Proxy is TransparentUpgradeableProxy {
    constructor(
        address _logic,
        address admin_,
        bytes memory _data
    ) TransparentUpgradeableProxy(_logic, admin_, _data) {}
} 