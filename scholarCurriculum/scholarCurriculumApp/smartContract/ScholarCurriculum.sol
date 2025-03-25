// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "./BirthCertificate.sol";

contract ScholarCurriculum{  
    //attributes
      uint public studentId; // student id 
    string public name; 
    string public fLastName; //father last name
    string public mLastName; //father last name
      bool public gender; //true will be man and false woman
      uint public dateCreation=0; // it contains the date the contract was created
      uint public dateLastUpdate=0;
   address public government; 
   address public owner;
    string public nameToken="CurriculumUPGdl";
//    address private birthCertificate;

    struct Achievement{
        string id; // identifier of the achievement
        string title; //the title of the achievement or the certificate in the university
        string date; //date of the achievement in epoch time
        string details; //additional details of the achievement
    }
        
    mapping(uint => Achievement) private achievements;
    uint private idAch=0;

  constructor(address _BirthCertificate, uint _studentId) {
  //  birthCertificate = _BirthCertificate;
    BirthCertificate birthCer = BirthCertificate(_BirthCertificate); 
    studentId = _studentId;
    name = birthCer.name(); 
    fLastName = birthCer.fLastName(); 
    mLastName = birthCer.mLastName(); 
    gender = birthCer.gender(); 
    owner = birthCer.owner();    
    dateCreation = block.timestamp;
    government = msg.sender;
  }

    modifier mustBeUniversity(){      
      require(msg.sender==government,"Executor must be the University");
      _;
    }

    function addAchievement(string memory id, string memory title, string memory date, string memory details) 
     public mustBeUniversity {
        achievements[idAch] = Achievement(id,title,date,details);
        idAch++;
    }

    function numberOfAchievements() public view returns (uint) {        
        return (idAch);
    }

    function getAchievement(uint id) public view returns (string memory) {
        require((idAch>0 && idAch>id),"Error: not achievement for such id");
        return string(
                        abi.encodePacked(
                            "{",
                            '"id":"', achievements[id].id, '",',
                            '"title":"', achievements[id].title, '",',
                            '"date":"', achievements[id].date, '",',
                            '"details":"', achievements[id].details, '"',
                            "}"
                        )
                    );
    }
}
