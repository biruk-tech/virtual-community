// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UserRegistry {
	// constructor() ERC20("UserToken", "UTK") {}
    struct User {
        string username;
        string profileHash;  // Could store IPFS hash for additional profile data
        bool isRegistered;
        uint256 registrationDate;
    }
    
    mapping(address => User) public users;
    
    event UserRegistered(address indexed userAddress, string username);
    
    function registerUser(string memory _username, string memory _profileHash) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        require(bytes(_username).length > 0, "Username cannot be empty");
        
        users[msg.sender] = User({
            username: _username,
            profileHash: _profileHash,
            isRegistered: true,
            registrationDate: block.timestamp
        });
        
        emit UserRegistered(msg.sender, _username);
    }

    function getUsername(address _user) public view returns (string memory) {
        require(users[_user].isRegistered, "User is not registered");
        return users[_user].username;
    }
}