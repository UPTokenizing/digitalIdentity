# DigitalIdentity: Architecture for a digital identity ecosystem based on blockchain
This repository will have all projects about digitizing physical objects and linking it with a person

## General description
  This is an architecture containing the following parts: 
  - An API-Gateway service;
  - A blockchain server access. This uses Ganache program (application part of Truffle Suite).
  - A genesis identity.


## Folders
  It is composed by the following folders:

  - ganache/
  - apigateway/
  - genesisIdentity/
  - smartContracts/

## Install
  Install the following instructions: 

  1. First, install docker, a guide for that visit [docker install](https://docs.docker.com/engine/install/).   
  2. Install Ganache: follow the instructions explained in file README.md within folder [ganache/](https://github.com/UPTokenizing/digitalIdentity/tree/main/ganache).
  3. Then, install API-Gateway, follow the instructions explained in file README.md within folder [apigateway/](https://github.com/UPTokenizing/digitalIdentity/tree/main/apigateway).
  4. Next, install GenesisIdentity, follow the instructions explained in file README.md within folder [genesisIdenity/](https://github.com/UPTokenizing/digitalIdentity/tree/main/genesisIdentity).

The next table illustrates the platforms that were already installed and tested the proofs successfully:

Operating System     |      Hardware characteristics                                                                   | Installed 
-----------------    | ------------------------------------                                                            | --------- 
Windows 10 Pro       | 11th Gen Intel(R) Core(TM) i7-1165G7,  @2.80GHz 1.69GHz, 32GB RAM, 64-bit, x64-based processor. |   Yes
Windows 10 Home      | AMD Ryzen 3 2300U with Radeon Vega, Mobile Gfx, 2000Mhz, 4CPUs AMI F.48, 12GB RAM, x64-based PC.|   Yes 
MACOS 14.4.1 (23E224)| Intel Iris Plus Graphics 1536 MB, 1.2 GHz Quad-Core Intel Core i7,  16 GB 3733 MHz LPDDR4X      |   Yes    

## Deployment
  Execute orderly the following instructions:    
  1. Follow the **Deployment** instructions explained in file README.md within folder [ganache/](https://github.com/UPTokenizing/digitalIdentity/tree/main/ganache).
  2. Then, follow the **Deployment** instructions explained in file README.md within folder [apigateway/](https://github.com/UPTokenizing/digitalIdentity/tree/main/apigateway).
  3. Next, follow the **Deployment** instructions explained in file README.md within folder [genesisIdenity/](https://github.com/UPTokenizing/digitalIdentity/tree/main/genesisIdentity).

You can execute the following command in the host operating system to check if everything is ok:
    
    curl -X GET http://localhost:5500/proof

It must return:
   
    Returning: route /proof

## Example to consume the services
To consume a list of services, check the following:
  
  1. Follow the instructions explained in file genesisIdentityServices.pdf within folder [genesisIdenity/genesisIdentityServices.pdf](https://github.com/UPTokenizing/digitalIdentity/blob/main/genesisIdentity/genesisIdentityServices.pdf)