// SPDX-License-Identifier: jclopezpimentel
pragma solidity 0.8.28;

//importing the interface
import "./OwnerInterface.sol";
import "./UsersInterface.sol";

contract GenesisIdentity is OwnerInterface{  
    //attributes
    string public name; 
    string public fLastName; 
    string public mLastName; 
      bool public gender; //true will be man and false woman
    uint16 public day; 
    uint16 public month; 
    uint16 public year;
    string public state;
    string public municipality;    
      uint public dateCreation=0; // it contains the date the contract was created
      uint public dateLastUpdate=0;
   address public tokenFather; //null 0x0000000000000000000000000000000000000000
   address public tokenMother;
   address public tokenDigIdentity;
   address public government;
   address public owner;
    string public nameToken="GenesisIdentity";
   
  constructor(string memory _name, string memory _fLastName, string memory _mLastName, bool _gender, 
              uint16 _day, uint16 _month, uint16 _year, string memory _state, string memory _municipality, 
              address _contractUser) {
    UsersInterface contractUsers = UsersInterface(_contractUser);
    require(contractUsers.getType(msg.sender)==0,"Incorrect government user");
    name = _name; 
    fLastName = _fLastName; 
    mLastName = _mLastName; 
    gender = _gender; //true will be man and false woman
    day = _day; 
    month = _month; 
    year = _year;
    state =_state;
    municipality = _municipality;
    dateCreation = block.timestamp;
    dateLastUpdate = dateCreation;
    tokenFather=address(0);
    tokenMother=address(0);
    tokenDigIdentity=address(0);
    government = msg.sender;
  }

    modifier mustBeGovernment(){
      require(msg.sender==government,"Incorrect government user");
      _;
    }
    function setFatherAddress(address fAddress) public mustBeGovernment {        
        tokenFather = fAddress;
        dateLastUpdate = block.timestamp;
    }

    function setMotherAddress(address mAddress) public mustBeGovernment {        
        tokenMother = mAddress;
        dateLastUpdate = block.timestamp;
    }

    function setDigitalIdentityAddress(address digIdentity) public mustBeGovernment {
        tokenDigIdentity = digIdentity;
        dateLastUpdate = block.timestamp;
    }

    function setOwner(address _owner) public  mustBeGovernment {        
        owner = _owner;
        dateLastUpdate = block.timestamp;
    }

}
