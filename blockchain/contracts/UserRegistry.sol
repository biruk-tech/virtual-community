// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";

contract UserRegistry {
    uint256 public usersCount;
    event AddUser(address recipient, uint256 userId);
    constructor() {
        usersCount = 0;
    }

    struct User {
        uint256 userId;
        address userAddress; // Unique identifier for the user
        bool isRegistered; // Flag to indicate if the user is registered
        uint256 registrationDate; // Timestamp of when the user registered
        uint256 balance; // User's balance of tokens
        bytes32[] permissions; // Array of permissions or roles assigned to the user
        bytes32 reputationToken; // User's reputation token (optional)
    }
    // User[] public users;
    mapping(address => User) public users;
    mapping(uint256 => address) public idToAddress;

    event UserRegistered(address indexed userAddress, string username);

    function registerUser(string memory _profileHash) public {
        require(!users[msg.sender].isRegistered, "User already registered");

        users[msg.sender] = User({
            userAddress: msg.sender,
            isRegistered: true,
            registrationDate: block.timestamp,
            balance: 0,
            permissions: new bytes32[](0),
            reputationToken: bytes32(0),
            userId: usersCount
        });

        idToAddress[usersCount] = msg.sender;

        emit UserRegistered(msg.sender, _profileHash);
    }

    function getUserAddress(uint256 _userId) public view returns (address) {
        return idToAddress[_userId];
    }

    function getAllUsers() public view returns (User[] memory) {
        console.log("usersCount:", usersCount);
        User[] memory usersList = new User[](usersCount);
        for (uint256 i = 0; i < usersCount; i++) {
            address userAddress = idToAddress[i];
            usersList[i] = users[userAddress];
        }
        console.log("usersList:", usersList.length);
        return usersList;
    }
}