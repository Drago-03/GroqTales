// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MonadStoryNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Base URI for metadata
    string private _baseURIextended;

    // Minting price
    uint256 public mintPrice = 0.001 ether;

    // Maximum supply
    uint256 public constant MAX_SUPPLY = 10000;

    // Mapping from token ID to story content hash (IPFS CID or similar)
    mapping(uint256 => string) private _storyContent;

    event StoryMinted(uint256 indexed tokenId, address indexed owner, string storyHash, string metadataURI);

    constructor() ERC721("GroqTales Story NFT", "GTALE") {
        _baseURIextended = "ipfs://";
    }

    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseURIextended = baseURI_;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }

    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }

    function mintStory(string memory storyHash, string memory metadataURI) 
        public 
        payable 
        returns (uint256)
    {
        require(msg.value >= mintPrice, "Insufficient payment for minting");
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < MAX_SUPPLY, "Maximum supply reached");

        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataURI);
        _storyContent[tokenId] = storyHash;

        emit StoryMinted(tokenId, msg.sender, storyHash, metadataURI);

        return tokenId;
    }

    function getStoryContent(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _storyContent[tokenId];
    }

    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    receive() external payable {}
} 