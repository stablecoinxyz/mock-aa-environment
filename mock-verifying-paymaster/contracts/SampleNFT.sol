// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SampleNFT is ERC721, Ownable {
    uint256 private _tokenIds;

    // Base URI for metadata
    string private _baseTokenURI;

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) Ownable(msg.sender) {}

    // Set base URI for metadata
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    // Override _baseURI internal function
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    // Mint new NFT (anyone can call this function)
    function mintNFT(address recipient) public returns (uint256) {
        uint256 newItemId = _tokenIds + 1;
        _safeMint(recipient, newItemId);
        return newItemId;
    }
}
