// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UserRegistry {
    uint256 public userCount;
    constructor() {
        userCount = 0;
}

    struct User {
        uint256 id;
        address userAddress; // Unique identifier for the user
        bool isRegistered; // Flag to indicate if the user is registered
        uint256 registrationDate; // Timestamp of when the user registered
        uint256 balance; // User's balance of tokens
        bytes32[] permissions; // Array of permissions or roles assigned to the user
        bytes32 reputationToken; // User's reputation token (optional)
    }

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
            id: userCount
        });

        idToAddress[userCount] = msg.sender;

        emit UserRegistered(msg.sender, _profileHash);
    }

    function getUserAddress(uint256 _id) public view returns (address) {
        return idToAddress[_id];
    }
}