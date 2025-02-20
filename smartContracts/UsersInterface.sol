// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
interface UsersInterface {
        function getType(address) external view returns (int);
        function getCreator(address _address) external view returns (address);
        function getDigIdentityAdd(address _address) external view returns (address);
        function userExists(address _address) external view returns (bool);
}    
