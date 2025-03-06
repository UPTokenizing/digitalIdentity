// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "./OwnerInterface.sol";
import "./UsersInterface.sol";

contract DigitalIdentity is OwnerInterface{  
    //errors
        string constant INCORRECT_GOVERNMENT = "V0001";
        string constant INCORRECT_OWNER = "V0002";
        string constant INCORRECT_OWNER_OF_CONTRACTADDRESS = "V0003";        
        string constant TOKEN_ALREADY_EXIST = "V0004"; 
        string constant NOT_GOVERNMENT = "V0005";
        
    //attributes
        address public owner;
         string public nameToken="DigitalIdentity";
        address public government;
        address private contractAddOfUsers;

        struct LinkedToken{
                address tokenAdd; //token to be added
                string nameToken; 
                address creator; //Address creator of the token, usually could be the government
                bool gcert; //true if the linked token is really a verified government
                            //false if not
                bool exists; // Boolean flag to track whether a user exists 
        }
        
        mapping(address => LinkedToken) private linkedTokens;
        address[] private addressesTokens;

    constructor(address _owner, address _contractOfUsers, address gover) {    
        require(msg.sender==_contractOfUsers,"Error: incorrect sender");        
        UsersInterface contractUsers = UsersInterface(_contractOfUsers);
        require(contractUsers.getType(gover)==0,INCORRECT_GOVERNMENT);
        contractAddOfUsers = _contractOfUsers;
        government = gover;        
        owner = _owner;
    }

    function linkToken(address contractAdd) public {
        require(msg.sender==owner,INCORRECT_OWNER);
        OwnerInterface contractFrom = OwnerInterface(contractAdd);
        require(msg.sender==contractFrom.owner(),INCORRECT_OWNER_OF_CONTRACTADDRESS);        
        require(contractFrom.government()!=address(0),NOT_GOVERNMENT);
        require(!linkedTokens[contractAdd].exists,TOKEN_ALREADY_EXIST);
        UsersInterface contractUsers = UsersInterface(contractAddOfUsers);
        bool gcert=false;
        if(contractUsers.userExists(contractFrom.government())){
            gcert = (contractUsers.getType(contractFrom.government())==0?true:false);
        }        
        linkedTokens[contractAdd] = LinkedToken(contractAdd,contractFrom.nameToken(),
            contractFrom.government(),gcert,true);
        addressesTokens.push(contractAdd);
    }

    function numberOfLinkedTokens() public view returns (uint) {        
        return (addressesTokens.length);
    }

    function getNameToken(address _tokenAdd) public view returns (string memory) {
        LinkedToken memory lToken = linkedTokens[_tokenAdd];
        return (lToken.nameToken);
    }

    function creatorIsGovernment(address _tokenAdd) public view returns (bool) {
        LinkedToken memory lToken = linkedTokens[_tokenAdd];
        return (lToken.gcert);
    }

    function getCreatorOfToken(address _tokenAdd) public view returns (address) {
        LinkedToken memory lToken = linkedTokens[_tokenAdd];
        return (lToken.creator);
    }
 }