// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./DigitalIdentity.sol";

contract Users is OwnerInterface, UsersInterface{ 
    struct User {
        address creator; //who create the user
        address didentity; //address of the digital identity
        int userType; //int (0 = Government, 1 = Admin, others = regular users)
    }   
    mapping(address => User) private users;

    address public owner;
     string public nameToken="Users";
    address public government;

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
    modifier userExistsIn(address _address) {
        require(users[_address].creator!=address(0), "User does not exist.");
        _; 
    }

    constructor() {        
        government = msg.sender; // The government deploy the contract
        owner = government; //The government is also the owner
        // Setting government userType to 0
        users[government] = User(government,address(0), 0); 
    }

    // Function to add new users
    function registerUser(
        address _userAddress,
        int _userType
    ) public onlyGovernmentOrAdmin(_userType) {
        require(users[_userAddress].creator==address(0),"User already exists");
        require(_userType >= 0, "UserType must be a non-negative integer."); // Validation for userType
        DigitalIdentity didentityAdd = new DigitalIdentity(_userAddress,address(this),msg.sender);
        users[_userAddress] = User(msg.sender, address(didentityAdd), _userType);        
    }

    function getType(address _address) public view userExistsIn(_address) returns (int) {
        return users[_address].userType;
    }

    function getCreator(address _address) public view userExistsIn(_address) returns (address) {
        return users[_address].creator;
    }

    function userExists(address _address) public view returns (bool){
        bool r = users[_address].creator!=address(0)?true:false;
        return(r);
    }

    function getDigIdentityAdd(address _address) public view returns (address){
        return (users[_address].didentity);
    }
 }