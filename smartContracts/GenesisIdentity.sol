pragma solidity 0.8.19;

contract GenesisIdentity{  

    //errors
        string constant INCORRECT_GOVERNMENT_USER = "V0001";
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

  constructor(string memory _name, string memory _fLastName, string memory _mLastName, bool _gender, 
              uint16 _day, uint16 _month, uint16 _year, string memory _state, string memory _municipality, address tFather, address tMother) {
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
    tokenFather=(tFather==address(0))?address(0):tFather;
    tokenMother=(tMother==address(0))?address(0):tMother;
    tokenDigIdentity=address(0);
    government = msg.sender;
  }

    function setFatherAddress(address fAddress) public {
        require(msg.sender==government,INCORRECT_GOVERNMENT_USER);
        tokenFather = fAddress;
        dateLastUpdate = block.timestamp;
    }

    function setMotherAddress(address mAddress) public {
        require(msg.sender==government,INCORRECT_GOVERNMENT_USER);
        tokenMother = mAddress;
        dateLastUpdate = block.timestamp;
    }

    function setDigitalIdentityAddress(address digIdentity) public {
        require(msg.sender==government,INCORRECT_GOVERNMENT_USER);
        tokenDigIdentity = digIdentity;
        dateLastUpdate = block.timestamp;
    }

    function getFullName() public view returns ( string memory, string memory, string memory) {
        return (name, fLastName, mLastName);
    }

    function getBirthDate() public view returns ( uint16, uint16, uint16) {
        return (day, month, year);
    }

    function getPlaceOfBirthDate() public view returns ( string memory, string memory) {
        return (municipality, state);
    }

    function getGender() public view returns ( bool) {
        return (gender);
    }

    function getDates() public view returns (uint,uint) {
        return (dateCreation,dateLastUpdate);
    }

    function getTokens() public view returns (address,address,address,address) {
        return (tokenFather,tokenMother,tokenDigIdentity,government);
    }

     // Function to return all public attributes
     /*
    function getAllAttributes() public view returns ( string memory, string memory, string memory, bool, uint16, uint16, uint16, string memory, string memory, uint, uint, address, address, address, address) {
        return (name, fLastName, mLastName, gender, day, month, year, state, municipality, dateCreation, dateLastUpdate, tokenFather, tokenMother, tokenDigIdentity, government);
    }*/
}
