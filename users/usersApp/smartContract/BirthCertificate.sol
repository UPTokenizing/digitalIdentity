// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

//importing the interface
import "./OwnerInterface.sol";
import "./UsersInterface.sol";

contract BirthCertificate is OwnerInterface{  
    //attributes
    string public name; 
    string public fLastName; //father last name
    string public mLastName; //father last name
      bool public gender; //true will be man and false woman
    uint16 private day; //day of birthdate
    uint16 private month; //month of birthdate
    uint16 private year; //year of birthdate
    string private state; //state of birthdate
    string private municipalty; //municipalty of birthdate   
      uint public dateCreation=0; // it contains the date the contract was created
      uint public dateLastUpdate=0;
   address public tokenFather; //null 0x0000000000000000000000000000000000000000
   address public tokenMother;
   address public government;
   address public owner;
    string public nameToken="BirthCertificate";
    
   address private cUsers;
   
  event governmentTransactions(
      address indexed executor,
         uint dateCreation
  );

  constructor(string memory _name, string memory _fLastName, string memory _mLastName, bool _gender, 
              uint16 _day, uint16 _month, uint16 _year, string memory _state, string memory _municipality, 
              address _contractUsers, address _owner) {
    cUsers = _contractUsers;
    UsersInterface contractUsers = UsersInterface(cUsers);    
    require(contractUsers.getCreator(_owner)!=address(0),"User already exists");
    require(contractUsers.getType(msg.sender)==0,"Incorrect government user");

    name = _name; 
    fLastName = _fLastName; 
    mLastName = _mLastName; 
    gender = _gender; //true will be man and false woman
    day = _day; 
    month = _month; 
    year = _year;
    state =_state;
    municipalty = _municipality;
    dateCreation = block.timestamp;
    dateLastUpdate = dateCreation;
    tokenFather=address(0);
    tokenMother=address(0);
    government = msg.sender;
    owner = _owner;
    emit governmentTransactions(msg.sender,dateCreation);
  }

    modifier mustBeGovernment(){
      UsersInterface contractUsers = UsersInterface(cUsers);    
      require(contractUsers.getType(msg.sender)==0,"Incorrect government user");
      _;
    }
    modifier ownerOrGovernment(){      
      UsersInterface contractUsers = UsersInterface(cUsers);    
      require((msg.sender==owner) || (contractUsers.getType(msg.sender)==0),"Owner or Governments can execute this method");
      _;
    }

    function setFatherAddress(address fAddress) public mustBeGovernment {        
        tokenFather = fAddress;
        dateLastUpdate = block.timestamp;
        emit governmentTransactions(msg.sender,dateCreation);
    }

    function setMotherAddress(address mAddress) public mustBeGovernment {        
        tokenMother = mAddress;
        dateLastUpdate = block.timestamp;
        emit governmentTransactions(msg.sender,dateCreation);
    }

    function getDay() public view ownerOrGovernment returns (uint16){
      return day;
    }

    function getMonth() public view ownerOrGovernment returns (uint16){
      return month;
    }

    function getYear() public view ownerOrGovernment returns (uint16){
      return year;
    }

    function getState() public view ownerOrGovernment returns (string memory){
      return state;
    }

    function getMunicipalty() public view ownerOrGovernment returns (string memory){
      return municipalty;
    }
}
