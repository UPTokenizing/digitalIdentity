// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

//importing the interface
import "./OwnerInterface.sol";
import "./UsersInterface.sol";

contract Users is OwnerInterface, UsersInterface{
    struct User {
        string username;
        string email;
        address creator; //who create the user
        int userType; //int (0 = Government, 1 = Admin, others = regular users)
        bool exists; //true means it exists
    }
   
    mapping(address => User) private users;

    address public owner;
    string public nameToken="Users";
    address public government;

    // Function to validate an email format
        // Ensures there’s an @ symbol.
        // Ensures there’s a . symbol after the @.
        // Ensures neither the @ symbol nor the . symbol are at the start or end of the email string.
    function isValidEmail(string memory email) private pure returns (bool) {
        bytes memory emailBytes = bytes(email);
        uint len = emailBytes.length;
        
        // Basic checks
        if (len < 5) return false; // Minimum possible email "a@b.c"
        
        bool atFound = false;
        bool dotAfterAtFound = false;
        
        for (uint i = 0; i < len; i++) {
            if (emailBytes[i] == "@") {
                // Ensure @ is neither at the start nor end, and appears only once
                if (i == 0 || i == len - 1 || atFound) return false;
                atFound = true;
            } else 
                if (emailBytes[i] == ".") {
                    // Ensure . is neither at the start nor end
                    if (i == 0 || i == len - 1) return false;
                    // Ensure there is a . after @
                    if (atFound) dotAfterAtFound = true;
            }
        }
        
        // The email is valid if we found both @ and a . after @
        return atFound && dotAfterAtFound;
    }    

    // Modifier to ensure that an email is valid
    modifier emailIsValid(string memory _email) {
        require(isValidEmail(_email),"Email is not valid");
        _;
    }

    constructor(string memory _email) emailIsValid(_email) {        
        government = msg.sender; // The government deploy the contract
        owner = government; //The government is also the owner
        // Setting government userType to 0
        users[government] = User("Government", _email, government, 0,true); 
    }

    // Modifier to ensure the government and/or admin can execute some actions
    modifier onlyGovernmentOrAdmin(int _userType) {
        if(_userType==0){
            require(
                users[msg.sender].userType == 0,
                "Only government can perform this action."
            );            
        }else{
            require(
                users[msg.sender].userType == 0 || users[msg.sender].userType == 1,
                "Only government or admin can perform this action."
            );
        }
        _;
    }

    //modifier to validate that users exist
    modifier userExists(address _address) {
        require(bytes(users[_address].username).length != 0, "User does not exist.");
        _; 
    }

    // Function to add new users
    function registerUser(
        address _userAddress,
        string memory _username,
        string memory _email,
        int _userType
    ) public onlyGovernmentOrAdmin(_userType)  emailIsValid(_email) {
        require(!users[_userAddress].exists,"User already exists");
        require(bytes(_username).length > 0, "Name cannot be empty.");
        require(_userType >= 0, "UserType must be a non-negative integer."); // Validation for userType
        
        users[_userAddress] = User(_username, _email, msg.sender, _userType,true);
    }

    function getType(address _address) public view userExists(_address) returns (int) {
        return users[_address].userType;
    }

    function getUserName(address _address) public view userExists(_address) returns (string memory) {
        return users[_address].username;
    }
   
    function getEmail(address _address) public view userExists(_address) returns (string memory) {
        return users[_address].email;
    }    

    function getCreator(address _address) public view userExists(_address) returns (address) {
        return users[_address].creator;
    }    
}