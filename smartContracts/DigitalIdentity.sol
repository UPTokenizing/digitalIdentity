// SPDX-License-Identifier: jclopezpimentel
pragma solidity 0.8.28;

//importing the interface
import "./OwnerInterface.sol";
import "./UsersInterface.sol";

contract DigitalIdentity is OwnerInterface{  
    //errors
        string constant INCORRECT_GOVERNMENT_USER = "V0001";
        string constant INCORRECT_OWNER_USER = "V0002";
        string constant INCORRECT_OWNER_OF_CONTRACTADDRESS = "V0003";
        string constant INCORRECT_TOKEN_NAME = "V0004";
        string constant TOKEN_ALREADY_EXIST = "V0005"; 
        string constant NOT_GOVERNMENT = "V0006"; 

    //attributes
        address public owner;
            string public nameToken="DigitalIdentity";
        address public government;

        struct LinkedToken{
                address tokenAdd;
                string nameToken;
                address extGovernment;
                bool exists; // Boolean flag to track whether a user exists 
        }
        
        mapping(address => LinkedToken) private linkedTokens;
        address[] public addressesTokens;

    constructor(address _owner, address _contractUser) {    
        UsersInterface contractUsers = UsersInterface(_contractUser);
        require(contractUsers.getType(msg.sender)==0,INCORRECT_GOVERNMENT_USER);
        government = msg.sender;
        owner = _owner;
    }

    function linkToken(address contractAdd, string memory _nameToken) public {
        require(msg.sender==owner,INCORRECT_OWNER_USER);
        OwnerInterface contractFrom = OwnerInterface(contractAdd);
        require(msg.sender==contractFrom.owner(),INCORRECT_OWNER_OF_CONTRACTADDRESS);
        require(keccak256(bytes(_nameToken)) == keccak256(bytes(contractFrom.nameToken())),INCORRECT_TOKEN_NAME);
        require(contractFrom.government()!=address(0),NOT_GOVERNMENT);
        require(!linkedTokens[contractAdd].exists,TOKEN_ALREADY_EXIST);
        linkedTokens[contractAdd] = LinkedToken(contractAdd,_nameToken,contractFrom.government(),true);
        addressesTokens.push(contractAdd);
    }

    function numberOfLinkedTokens() public view returns (uint) {        
        return (addressesTokens.length);
    }

    function getNameToken(address _tokenAdd) public view returns (string memory) {
        LinkedToken memory lToken = linkedTokens[_tokenAdd];
        return (lToken.nameToken);
    }

    function getGovernmentOfToken(address _tokenAdd) public view returns (address) {
        LinkedToken memory lToken = linkedTokens[_tokenAdd];
        return (lToken.extGovernment);
    }
 }