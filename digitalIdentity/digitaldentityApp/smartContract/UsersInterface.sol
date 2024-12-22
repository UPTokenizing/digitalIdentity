// SPDX-License-Identifier: jclopezpimentel
pragma solidity 0.8.23;
interface UsersInterface {
        function getType(address) external view returns (int);
        function getName(address) external view returns (string memory);
        function getLastName(address _address) external view returns (string memory);
        function getEmail(address _address) external view returns (string memory);
        function getCreator(address _address) external view returns (address);
}    
