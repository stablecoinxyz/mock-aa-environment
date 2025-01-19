// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SBC Token
 * @dev Simple ERC20 Token for testing the SignatureVerifyingPaymaster
 */
contract SBC is ERC20, Ownable {
    // Decimals for token (standard 18)
    uint8 private constant DECIMALS = 18;
    // Initial supply of 1 million tokens
    uint256 private constant INITIAL_SUPPLY = 1_000_000;

    /**
     * @dev Constructor mints initial supply to deployer
     */
    constructor() ERC20("Stable Coin Test Token", "SBC") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY * 10**DECIMALS);
    }

    /**
     * @dev Mint new tokens 
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    /**
     * @dev Public function to mint small amount of tokens for testing
     * @notice Limited to 100 tokens per mint to prevent abuse
     */
    function mintTestTokens() external {
        _mint(msg.sender, 100 * 10**DECIMALS);  // Mint 100 tokens
    }

    /**
     * @dev Override decimals to match constant
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }
}
