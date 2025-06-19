# DigitalIdentity: Architecture for a digital identity ecosystem based on blockchain
This repository will have all projects about digitizing physical objects, linking them with a person.

## General description
  This is an architecture containing the following parts: 
  - An API-Gateway service;
  - A blockchain server access. This uses the Ganache program (application part of the Truffle Suite).
  - MySQL database.
  - Birth certificate.
  - Digital identity.
  - Scholar Curriculum for a University.
  - User system. 
  - EC2 instance (AWS).

## Folders
  It is composed of the following folders:

  - ganache/
  - apigateway/
  - birthCertificate/
  - smartContracts/
  - users/
  - scholarCurriculum/
  - digitalIdentity/
  - frontendUsersInteface/
  - frontendBirthCertificate/
  - frontendIdentityDigital/
  - frontendScholarCurriculum/




## Tested Enviroments

The next table illustrates the platforms that were already installed and tested the proofs successfully:

Operating System     |      Hardware characteristics                                                                   | Installed 
-----------------    | ------------------------------------                                                            | --------- 
Windows 10 Pro       | 11th Gen Intel(R) Core(TM) i7-1165G7,  @2.80GHz 1.69GHz, 32GB RAM, 64-bit, x64-based processor. |   Yes
Windows 10 Home      | AMD Ryzen 3 2300U with Radeon Vega, Mobile Gfx, 2000Mhz, 4CPUs AMI F.48, 12GB RAM, x64-based PC.|   Yes 
MACOS 14.4.1 (23E224)| Intel Iris Plus Graphics 1536 MB, 1.2 GHz Quad-Core Intel Core i7,  16 GB 3733 MHz LPDDR4X      |   Yes    
Windows 11 Home      |  i7-11800H, @2.80GHz, 32GB RAM, 64-bit, x64-based processor, with NVIDIA RTX 3070, x64-based PC.|   Yes
Windows 11 Home      | AMD Ryzen 3600 with NVIDIA RTX 2060, 3.6GHz, 6 Cores, 16GB RAM, x64-based PC                    |   Yes
Ubuntu 24.04 LTS(AWS)| Amazon Web Service, m5.large, 2 vCPUs, 8GB RAM, 18GB SSD, 64 bits x86-based instance            |   Yes





## Environment-Based Installation
Before proceeding to the installation steps, it is required to set the environment. We provide two options [Amazon Web Services (AWS)](https://github.com/UPTokenizing/digitalIdentity/blob/main/AWS-Setup.md) or within a [local machine](https://github.com/UPTokenizing/digitalIdentity/blob/main/Local-Setup.md).


---

## Deployment
  Execute the following instructions:    
  1. Follow the **Deployment** instructions explained in file README.md within folder [ganache/](https://github.com/UPTokenizing/digitalIdentity/tree/main/ganache/Deployment.md).
  2. Then, follow the **Deployment** instructions explained in file README.md within folder [apigateway/](https://github.com/UPTokenizing/digitalIdentity/tree/main/apigateway/Deployment.md).
  3. Next, follow the **Deployment** instructions explained in file README.md within folder [birthCertificate/](https://github.com/UPTokenizing/digitalIdentity/tree/main/birthCertificate/Deployment.md).
  4. Following with the **Deployment** instructions explained in file README.md within folder [digitalIdentity/](https://github.com/UPTokenizing/digitalIdentity/tree/main/digitalIdentity/Deployment.md).
  5. After digital Identity, follow the **Deployment** instructions explained in file README.md within folder [users/](https://github.com/UPTokenizing/digitalIdentity/tree/main/users/Deployment.md).
  6. After digital Identity, follow the **Deployment** instructions explained in file README.md within folder [scholarCurriculum/](https://github.com/UPTokenizing/digitalIdentity/tree/main/scholarCurriculum/Deployment.md). **NOTE**
  7. Lastly, follow the **Deployment** instructions explained in file README.md within the folders of for the user interactions [frontendBirthCertificate/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendBirthCertificate/Deployment.md), [frontendIdentityDigital/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendIdentityDigital/Deployment.md), [frontendUsersInterface/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendUsersInteface/Deployment.md), [frontendScholarCurriculum/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendScholarCurriculum/Deployment.md).
  
  > **NOTE:** If the project is within a local machine, the MySQL container should start running after the *`scholarCurriculum`* container (This is for the IP assignation).

  #### **NOTE:**  After completing the installation and deployment process, the next step is going to the users web page at the route /registerGovernment (for example, PUBLIC_IP:5512/registerGovernment) and register the initial critical user of the system. Then, follow the [User Manual](https://github.com/UPTokenizing/digitalIdentity/blob/main/UserManual.pdf).

You can execute the following command in the host operating system to check if every service is ok:
    
    curl -X GET http://localhost:5500/proof
    curl -X GET http://localhost:5500/proofd
    curl -X GET http://localhost:5500/proofu
    curl -X GET http://localhost:5500/proofsc


It must return:
   
    Returning: route /proof
    Returning: route /proof digital
    Returning: route /proof users
    Returning: route /proof scholarCertificates

## Example to consume the services
To consume a list of services, check the following:
  
  1. Follow the instructions explained in file birthCertificateServices.pdf within folder [birthCertificate/birthCertificateServices.pdf](https://github.com/UPTokenizing/digitalIdentity/blob/main/birthCertificate/birthCertificateServices.pdf)
  2. Follow the instructions explained in file digitalIdentityServices.pdf within folder [digitalIdentity/digitalIdentityServices.pdf](https://github.com/UPTokenizing/digitalIdentity/blob/main/digitalIdentity/digitalIdentityServices.pdf)
  3. Follow the instructions explained in file usersServices.pdf within folder [users/usersServices.pdf](https://github.com/UPTokenizing/digitalIdentity/blob/main/users/usersServices.pdf)
  4. Follow the instructions explained in file usersServices.pdf within folder [scholarCurriculum/scholarCurriculumServices.pdf](https://github.com/UPTokenizing/digitalIdentity/blob/main/scholarCurriculum/scholarCurriculumServices.pdf)
        
