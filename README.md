# DigitalIdentity: Architecture for a digital identity ecosystem based on blockchain
This repository will have all projects about digitizing physical objects, linking them with a person, and setting them up either on [Amazon Web Services (AWS)](https://github.com/UPTokenizing/digitalIdentity?tab=readme-ov-file#aws-setup) or a [local machine](https://github.com/UPTokenizing/digitalIdentity?tab=readme-ov-file#local-setup).

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

## AWS Setup  
Follow these steps to configure your AWS environment:

1. **Launch an EC2 Instance**  
   - Use instance type `m5.large` (2 vCPUs, 8 GB RAM).  
   - Select Ubuntu (24.04 LTS or newer) as the OS.  
   - Set your RSA keys and keep them safe. (You can only download them once)
   - Set the VPC and Security groups according to your needs.
   - Allocate at least **18 GB** of storage.  
   - Allow inbound access on ports `22` (SSH), `80`, `443`, `3306` and any custom ports your backend uses.
   ***For this project: allow ports `5500–5515`***

2. **Create a MySQL RDS Instance**  
   - Engine: MySQL  
   - Template: Free tier
   - Configure credentials:
     * Set a master username
     * Set a well-secured Master Password and keep it safe
   - Instance type: `db.t3.micro` or higher  
   - Storage: 20 GB (General Purpose SSD)  
   - Enable EC2 connectivity  
   - Select the desired instance that will connect to the Database (Ex, TokenizingEC2)
   - Select the security group used by the EC2 instance
   - Note down the endpoint, port, username, and password.

3. **Configure RDS Security Group**  
   - Allow or verify inbound connections on port `3306`.  
   - Only allow traffic from your EC2's security group or your current IP address.

4. **Recommended EC2 Setup**
   - Update & Upgrade System
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

   - Install Git
   ```bash
   sudo apt install git -y
   ```

   - Install MySQL Client
   ```bash
   sudo apt install mysql-client -y
   ```

   - Install Nano (for editing .env or scripts)
   ```bash
   sudo apt install nano -y 
   ```
  
5. **Initialize MySQL Database**

   From your EC2 instance, follow these steps to connect and set up your MySQL database hosted on AWS RDS.

   #### Step 1: Connect to MySQL
   Use the endpoint of your RDS instance, your MySQL username, and password:

   ```bash
   mysql -h <your-endpoint> -u <username> -p
   ```

   #### Step 2: Create the Database
   Once inside the MySQL shell, run the following SQL command to create the database (you can change the name if needed):

   ```sql
   CREATE DATABASE digital_identity;
   EXIT;
   ```

6. **Install Project on EC2**  
   SSH into your instance and follow the installation guide in the Install Section.

7. **Connect MySQL with the frontend**  
   For the database to connect directly with the frontend, create a `.env` file in the root folder of your project (the same directory where the server.js file is located) with the following settings as an example:
   ```env
   DB_HOST=tokphy-mysql.xxxxxxxxxx.us-east-2.rds.amazonaws.com
   DB_USER=root
   DB_PASSWORD=root_pw123
   DB_NAME=digital_identity
   JWT_SECRET=your_secure_secret_key_here
   ```
   > **NOTE:** The secret key is a session token.

# Local Setup

Before proceeding to step 8 of the installation instructions, it's necessary to create a MySQL container where the database will be connected. Follow these steps:

1. **Create the MySQL container**  
   In the following command, you'll need to customize the `--name`, `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, and `MYSQL_PASSWORD` values. The last two parameters contain the login information for MySQL, and `MYSQL_DATABASE` is where the database name is assigned.
   ```bash
   docker run -d --name tokphy-mysql --network TokPhyAppNetwork -e MYSQL_ROOT_PASSWORD=root_pw123 -e MYSQL_DATABASE=tokphydb -e MYSQL_USER=tokuser -e MYSQL_PASSWORD=user_pw123 -p 3306:3306 mysql:8
   ```
   > **NOTE:** The MySQL container should start running after the *`scholarCurriculum`* container, so in his case it is necessary to stop the container if it is running.
   

2. **Connect MySQL with the frontend**  
   To connect the database directly to the frontend, create a `.env` file in the root folder of every frontend project (the same directory where the server.js file is located) with the following settings based on the past example:
   ```env
   DB_HOST=tokphy-mysql
   DB_USER=tokuser
   DB_PASSWORD=user_pw123
   DB_NAME=tokphydb
   JWT_SECRET=your_secure_secret_key_here
   ```
   > **NOTE:** The secret key is a session token.
   
   > **NOTE:** The MySQL container should start running after the *`scholarCurriculum`* container.
   
   > **NOTE:** To write down the .env it is recommended to stop the frontends (Not the container, just the application).

## Install
  Follow the following instructions. **The project should have already been cloned from git**

  1. First, install docker, a guide for that visit [docker install](https://docs.docker.com/engine/install/).   
  2. Install Ganache: follow the instructions explained in the file README.md within the folder [ganache/](https://github.com/UPTokenizing/digitalIdentity/tree/main/ganache).
  3. Then, install API-Gateway, follow the instructions explained in the file README.md within the folder [apigateway/](https://github.com/UPTokenizing/digitalIdentity/tree/main/apigateway).
  4. Next, install BirthCertificate, follow the instructions explained in the file README.md within the folder [birthCertificate/](https://github.com/UPTokenizing/digitalIdentity/tree/main/birthCertificate).
  5. Next, install DigitalIdentity, follow the instructions explained in the file README.md within the folder [digitalIdentity/](https://github.com/UPTokenizing/digitalIdentity/tree/main/digitalIdentity).
  6. After that, install Users module, follow the instructions explained in the file README.md within the folder [users/](https://github.com/UPTokenizing/digitalIdentity/tree/main/users).
  7. Then, install ScholarCurriculum, follow the instructions explained in the file README.md within the folder [scholarCurriculum/](https://github.com/UPTokenizing/digitalIdentity/tree/main/scholarCurriculum).
  8. Lastly, install the frontend applications, follow the instructions explained in the file README.md within the folders [frontendBirthCertificate/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendBirthCertificate), [frontendIdentityDigital/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendIdentityDigital), [frontendUsersInteface/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendUsersInteface), and [frontendScholarCurriculum/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendScholarCurriculum).

The next table illustrates the platforms that were already installed and tested the proofs successfully:

Operating System     |      Hardware characteristics                                                                   | Installed 
-----------------    | ------------------------------------                                                            | --------- 
Windows 10 Pro       | 11th Gen Intel(R) Core(TM) i7-1165G7,  @2.80GHz 1.69GHz, 32GB RAM, 64-bit, x64-based processor. |   Yes
Windows 10 Home      | AMD Ryzen 3 2300U with Radeon Vega, Mobile Gfx, 2000Mhz, 4CPUs AMI F.48, 12GB RAM, x64-based PC.|   Yes 
MACOS 14.4.1 (23E224)| Intel Iris Plus Graphics 1536 MB, 1.2 GHz Quad-Core Intel Core i7,  16 GB 3733 MHz LPDDR4X      |   Yes    
Windows 11 Home      |  i7-11800H, @2.80GHz, 32GB RAM, 64-bit, x64-based processor, with NVIDIA RTX 3070, x64-based PC.|   Yes
Windows 11 Home      | AMD Ryzen 3600 with NVIDIA RTX 2060, 3.6GHz, 6 Cores, 16GB RAM, x64-based PC                    |   Yes
Ubuntu 24.04 LTS(AWS)| Amazon Web Service, m5.large, 2 vCPUs, 8GB RAM, 18GB SSD, x64-based instance                    |   Yes



## Deployment
  Execute the following instructions:    
  1. Follow the **Deployment** instructions explained in file README.md within folder [ganache/](https://github.com/UPTokenizing/digitalIdentity/tree/main/ganache).
  2. Then, follow the **Deployment** instructions explained in file README.md within folder [apigateway/](https://github.com/UPTokenizing/digitalIdentity/tree/main/apigateway).
  3. Next, follow the **Deployment** instructions explained in file README.md within folder [birthCertificate/](https://github.com/UPTokenizing/digitalIdentity/tree/main/birthCertificate).
  4. Following with the **Deployment** instructions explained in file README.md within folder [digitalIdentity/](https://github.com/UPTokenizing/digitalIdentity/tree/main/digitalIdentity).
  5. After digital Identity, follow the **Deployment** instructions explained in file README.md within folder [users/](https://github.com/UPTokenizing/digitalIdentity/tree/main/users).
  6. After digital Identity, follow the **Deployment** instructions explained in file README.md within folder [scholarCurriculum/](https://github.com/UPTokenizing/digitalIdentity/tree/main/scholarCurriculum).
  7. Lastly, follow the **Deployment** instructions explained in file README.md within the folders of for the user interactions [frontendBirthCertificate/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendBirthCertificate), [frontendIdentityDigital/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendIdentityDigital), [frontendUsersInteface/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendUsersInteface), [frontendScholarCurriculum/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendScholarCurriculum).


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
        
