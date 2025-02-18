// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
interface OwnerInterface {
        function owner() external view returns (address);
        function nameToken() external view returns (string memory); 
        function government() external view returns (address);
}    
