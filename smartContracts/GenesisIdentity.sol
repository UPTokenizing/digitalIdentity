// SPDX-License-Identifier: jclopezpimentel
pragma solidity 0.8.19;

interface ContractFrom {
        function owner() external view returns (address);
        function nameToken() external view returns (string memory); 
}    

contract DigitalIdentity is ContractFrom{  

    //errors
        string constant INCORRECT_GOVERNMENT_USER = "V0001";
        string constant INCORRECT_OWNER_USER = "V0002";
        string constant INCORRECT_OWNER_OF_CONTRACTADDRESS = "V0003";
        string constant INCORRECT_TOKEN_NAME = "V0004";
        string constant TOKEN_ALREADY_EXIST = "V0005"; 
         

    //attributes
        address public owner;
            string public nameToken="DigitalIdentity";
        address public government;

        struct LinkedToken{
                address tokenAdd;
                string nameToken;
                bool exists; // Boolean flag to track whether a user exists 
        }
        mapping(address => LinkedToken) private linkedTokens;
        address[] public addressesTokens;
    constructor(address _owner) {    
        owner = _owner;
        government = msg.sender;
    }

    function linkToken(address contractAdd, string memory _nameToken) public {
        require(msg.sender==owner,INCORRECT_OWNER_USER);
        ContractFrom contractFrom = ContractFrom(contractAdd);
        require(msg.sender==contractFrom.owner(),INCORRECT_OWNER_OF_CONTRACTADDRESS);
        require(keccak256(bytes(_nameToken)) == keccak256(bytes(contractFrom.nameToken())),INCORRECT_TOKEN_NAME);
        require(!linkedTokens[contractAdd].exists,TOKEN_ALREADY_EXIST);
        linkedTokens[contractAdd] = LinkedToken(contractAdd,_nameToken,true);
        addressesTokens.push(contractAdd);
    }

    function getNameToken(address _tokenAdd) public view returns (string memory) {
        LinkedToken memory lToken = linkedTokens[_tokenAdd];
        return (lToken.nameToken);
    }

    function numberOfLinkedTokens() public view returns (uint) {        
        return (addressesTokens.length);
    }
 }