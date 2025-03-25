// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

/**
 * @title SignatureVerifyingPaymasterV07ProxyAdmin
 * @dev Admin contract for managing SignatureVerifyingPaymasterV07Proxy upgrades
 */
contract SignatureVerifyingPaymasterV07ProxyAdmin is ProxyAdmin {
    constructor(address owner_) ProxyAdmin(owner_) {}
} 