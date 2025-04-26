// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../contracts/MonadStoryNFT.sol";

contract DeployMonadStoryNFT is Script {
    function run() external {
        // Load private key from environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract
        MonadStoryNFT storyNFT = new MonadStoryNFT();
        console.log("MonadStoryNFT deployed to:", address(storyNFT));

        // Optionally, transfer ownership to a different address if needed
        // storyNFT.transferOwnership(newOwnerAddress);

        vm.stopBroadcast();
    }
} 