// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./SignatureVerifyingPaymasterV07.sol";
import "./SignatureVerifyingPaymasterV07Proxy.sol";
import "./SignatureVerifyingPaymasterV07ProxyAdmin.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import { IEntryPoint } from "@account-abstraction/contracts/interfaces/IEntryPoint.sol";

/**
 * @title SignatureVerifyingPaymasterV07Factory
 * @dev Factory contract for deterministic deployment of SignatureVerifyingPaymasterV07
 * This factory deploys the implementation, proxy admin, and proxy contracts using CREATE2
 */
contract SignatureVerifyingPaymasterV07Factory {
    bytes32 public constant IMPLEMENTATION_SALT = keccak256("SignatureVerifyingPaymasterV07_Implementation_V1");
    bytes32 public constant PROXY_ADMIN_SALT = keccak256("SignatureVerifyingPaymasterV07_ProxyAdmin_V1");
    bytes32 public constant PROXY_SALT = keccak256("SignatureVerifyingPaymasterV07_Proxy_V1");

    /**
     * @dev Deploys the entire paymaster system deterministically
     * @param entryPoint The EntryPoint contract address
     * @param verifyingSigner The address authorized to sign paymaster approvals
     * @param owner The address that will own the paymaster
     * @return proxy The address of the deployed proxy contract
     */
    function deployPaymaster(
        IEntryPoint entryPoint,
        address verifyingSigner,
        address owner
    ) external returns (address proxy) {
        // 1. Deploy implementation
        bytes memory implementationCode = abi.encodePacked(
            type(SignatureVerifyingPaymasterV07).creationCode,
            abi.encode(entryPoint)  // Pass EntryPoint in constructor
        );

        address implementation = Create2.deploy(
            0, // no value sent
            IMPLEMENTATION_SALT,
            implementationCode
        );

        // 2. Deploy proxy admin
        address proxyAdmin = Create2.deploy(
            0, // no value sent
            PROXY_ADMIN_SALT,
            abi.encodePacked(
                type(SignatureVerifyingPaymasterV07ProxyAdmin).creationCode,
                abi.encode(owner)
            )
        );

        // 3. Prepare initialization data
        bytes memory initData = abi.encodeWithSelector(
            SignatureVerifyingPaymasterV07.initialize.selector,
            verifyingSigner,
            owner
        );

        // 4. Deploy proxy
        proxy = Create2.deploy(
            0, // no value sent
            PROXY_SALT,
            abi.encodePacked(
                type(SignatureVerifyingPaymasterV07Proxy).creationCode,
                abi.encode(
                    implementation,
                    proxyAdmin,
                    initData
                )
            )
        );
    }

    /**
     * @dev Computes the deterministic addresses for all contracts before deployment
     * @return implementation The address where the implementation will be deployed
     * @return proxyAdmin The address where the proxy admin will be deployed
     * @return proxy The address where the proxy will be deployed
     */
    function computeAddresses() external view returns (
        address implementation,
        address proxyAdmin,
        address proxy
    ) {
        implementation = Create2.computeAddress(
            IMPLEMENTATION_SALT,
            keccak256(type(SignatureVerifyingPaymasterV07).creationCode)
        );

        proxyAdmin = Create2.computeAddress(
            PROXY_ADMIN_SALT,
            keccak256(
                abi.encodePacked(
                    type(SignatureVerifyingPaymasterV07ProxyAdmin).creationCode,
                    abi.encode(address(this)) // temporary owner, will be transferred
                )
            )
        );

        bytes memory initData = abi.encodeWithSelector(
            SignatureVerifyingPaymasterV07.initialize.selector,
            address(0), // temporary values, will be set during actual deployment
            address(0)
        );

        proxy = Create2.computeAddress(
            PROXY_SALT,
            keccak256(
                abi.encodePacked(
                    type(SignatureVerifyingPaymasterV07Proxy).creationCode,
                    abi.encode(
                        implementation,
                        proxyAdmin,
                        initData
                    )
                )
            )
        );
    }
} 