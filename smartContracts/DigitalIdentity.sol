// SPDX-License-Identifier: jclopezpimentel
pragma solidity 0.8.19;

interface ContractFrom {
        function owner() external view returns (address);
        function nameToken() external view returns (string memory); 
}    

contract DigitalIdentity{  

    //errors
        string constant INCORRECT_GOVERNMENT_USER = "V0001";
        string constant INCORRECT_OWNER_USER = "V0002";
        string constant INCORRECT_OWNER_OF_CONTRACTADDRESS = "V0003";
        string constant INCORRECT_TOKEN_NAME = "V0004";

    //attributes
   address public owner;
   address public government;

   struct LinkedToken{
        address tokenAdd;
        string nameToken; 
   }

    mapping(address => LinkedToken) private linkedTokens;

    constructor(address _owner) {    
        owner = _owner;
        government = msg.sender;
    }

    function linkToken(address contractAdd, string memory _nameToken) public {
        require(msg.sender==owner,INCORRECT_OWNER_USER);
        ContractFrom contractFrom = ContractFrom(contractAdd);
        require(msg.sender==contractFrom.owner(),INCORRECT_OWNER_OF_CONTRACTADDRESS);
        require(keccak256(bytes(_nameToken)) == keccak256(bytes(contractFrom.nameToken())),INCORRECT_TOKEN_NAME);
        linkedTokens[contractAdd] = LinkedToken(contractAdd,_nameToken);
    }

        // Retrieve a user's details
    function getNameToken(address _tokenAdd) public view returns (string memory) {
        LinkedToken memory lToken = linkedTokens[_tokenAdd];
        return (lToken.nameToken);
    }
}