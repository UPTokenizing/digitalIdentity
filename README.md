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
Before proceeding to the installation steps, it is required to set the environment. We provide two options [Amazon Web Services (AWS)](https://github.com/UPTokenizing/digitalIdentity?tab=readme-ov-file#aws-setup) or within a [local machine](https://github.com/UPTokenizing/digitalIdentity?tab=readme-ov-file#local-setup).

### AWS  
Follow these steps to configure your AWS environment:

1. **Launch an EC2 Instance**
   - Name your Instance, Ex: "TokenizingEC2"
   - Use instance type `m5.large` (2 vCPUs, 8 GB RAM) 64 bits x86-based instance.  
   - Select Ubuntu (24.04 LTS or newer) as the OS.  
   - Set your RSA keys and keep them safe. (You can only download them once)
   - Set the VPC and Security groups according to your needs.
   - Allocate at least **18 GB** of storage.  
   - Allow inbound access on TCP ports `22` (SSH), `80`, `443`, `3306` and any custom ports your backend uses.
   ***For this project: allow TCP ports `5500–5515`***

3. **Create a MySQL RDS Instance**  
   - Engine: MySQL
   - Version: 8 or newer
   - Template: Free tier
   - Configure credentials:
     * Set a master username
     * Set a well-secured Master Password and keep it safe
   - Instance type: `db.t3.micro` or higher  
   - Storage: 20 GB (General Purpose SSD)  
   - Enable EC2 connectivity  
   - Select the desired instance that will connect to the Database (Ex, TokenizingEC2 (previously created Instance))
   - Select the security group used by the EC2 instance
   - Note down the endpoint, port, username, and password.

4. **Configure RDS Security Group**  
   - Allow or verify inbound connections on port `3306`.  
   - Only allow traffic from your EC2's security group or your current IP address.

5. **Recommended EC2 Setup**
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
  
6. **Initialize MySQL Database**

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

7. **Install Project on the EC2**  
   **Clone the project from the Github: https://github.com/UPTokenizing/digitalIdentity.git**
   ```bash
   git clone https://github.com/UPTokenizing/digitalIdentity.git
   ```
   Now, install following any of the two options: [Manually](https://github.com/UPTokenizing/digitalIdentity?tab=readme-ov-file#Manual-Installation-option) or [Semi-automatic](https://github.com/UPTokenizing/digitalIdentity?tab=readme-ov-file#Semi-Automatic-Installation-option).

   * #### Manual Installation option
      - #### Step 1.
        First, install docker, a guide for that visit [docker install](https://docs.docker.com/engine/install/).   
      - #### Step 2.
        Install Image container: follow the instructions explained in the file README.md within the folder [image/](https://github.com/UPTokenizing/digitalIdentity/tree/main/image).
      - #### Step 3.
        Install Ganache: follow the instructions explained in the file README.md within the folder [ganache/](https://github.com/UPTokenizing/digitalIdentity/tree/main/ganache).
      - #### Step 4.
        Then, install API-Gateway, follow the instructions explained in the file README.md within the folder [apigateway/](https://github.com/UPTokenizing/digitalIdentity/tree/main/apigateway).
      - #### Step 5.
        Next, install BirthCertificate, follow the instructions explained in the file README.md within the folder [birthCertificate/](https://github.com/UPTokenizing/digitalIdentity/tree/main/birthCertificate).
      - #### Step 6.
        Next, install DigitalIdentity, follow the instructions explained in the file README.md within the folder [digitalIdentity/](https://github.com/UPTokenizing/digitalIdentity/tree/main/digitalIdentity).
      - #### Step 7.
        After that, install Users module, follow the instructions explained in the file README.md within the folder [users/](https://github.com/UPTokenizing/digitalIdentity/tree/main/users).
      - #### Step 8.
        Then, install ScholarCurriculum, follow the instructions explained in the file README.md within the folder [scholarCurriculum/](https://github.com/UPTokenizing/digitalIdentity/tree/main/scholarCurriculum).
      - #### Step 9.
        **Connect MySQL with the frontend**  
        To connect the database directly to the frontend, create a .env file in the root folder of every frontend project (the same directory where the server.js file is located, for example, for project **frontendIdentityDigital** the path is [digitalIdentity/frontendIdentityDigital/frontendDigitalApp/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendIdentityDigital/frontendDigitalApp/)  ) with the following settings (it is based on the past example):
        ```env
        DB_HOST=<DB endpoint. EX: tokphy-mysql.xxxxxxxxxx.us-east-2.rds.amazonaws.com>
        DB_USER=root
        DB_PASSWORD="root_pw123"
        DB_NAME=digital_identity
        JWT_SECRET=<your_secure_secret_key_here>
        ```
        > **NOTE:**  The JWT secret value is a session token.

      - #### Step 10.
        Lastly, install the frontend applications, follow the instructions explained in the file README.md within the folders [frontendBirthCertificate/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendBirthCertificate), [frontendIdentityDigital/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendIdentityDigital), [frontendUsersInteface/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendUsersInteface), and [frontendScholarCurriculum/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendScholarCurriculum).

    * #### Semi-Automatic Installation option
      This method spins up all required Docker containers automatically, but you will still need to perform some manual configuration inside each service. 
      - #### Step 1.
        Install **Docker Compose**, in your comand console run the following command:
        ```bash
        apt  install docker-compose -y
        ```
        > **NOTE:** You can verify that Docker Compose is installed and working. 
        ```bash 
        docker-compose --version
        ```
    
      - #### Step 2.
        Run the **docker-compose.yml**, in your comand console run the following command:
        ```bash
        sudo docker-compose up -d
        ```
        > **NOTE:** You can undo what the compose did with the next command. 
        ```bash 
        sudo docker-compose down
        ```
    
      - #### Step 3.
        Follow the individual README instructions from the `Go into container <SERVICE NAME> by checking the CONTAINER ID with the following:` in the **Installation Section** to complete the setup after the containers are running.

        - Complete **Ganache** installation: [ganache/](https://github.com/UPTokenizing/digitalIdentity/tree/main/ganache).
        - Complete **API-Gateway** installation: [apigateway/](https://github.com/UPTokenizing/digitalIdentity/tree/main/apigateway).
        - Complete **BirthCertificate** installation: [birthCertificate/](https://github.com/UPTokenizing/digitalIdentity/tree/main/birthCertificate).
        - Complete **DigitalIdentity** installation: [digitalIdentity/](https://github.com/UPTokenizing/digitalIdentity/tree/main/digitalIdentity).
        - Complete **Users** module installation: [users/](https://github.com/UPTokenizing/digitalIdentity/tree/main/users).
        - Complete **ScholarCurriculum** installation: [scholarCurriculum/](https://github.com/UPTokenizing/digitalIdentity/tree/main/scholarCurriculum).
        - **Connect MySQL with the frontend**  
            To connect the database directly to the frontend, create a .env file in the root folder of every frontend project (the same directory where the server.js file is located, for example, for project **frontendIdentityDigital** the path is [digitalIdentity/frontendIdentityDigital/frontendDigitalApp/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendIdentityDigital/frontendDigitalApp/)  ) with the following settings (it is based on the past example):
            ```env
            DB_HOST=<DB endpoint. EX: tokphy-mysql.xxxxxxxxxx.us-east-2.rds.amazonaws.com>
            DB_USER=root
            DB_PASSWORD="root_pw123"
            DB_NAME=digital_identity
            JWT_SECRET=<your_secure_secret_key_here>
            ```
            > **NOTE:**  The JWT secret value is a session token.
        - Complete the **Front-Ends** installation: [frontendBirthCertificate/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendBirthCertificate), [frontendIdentityDigital/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendIdentityDigital), [frontendUsersInteface/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendUsersInteface), and [frontendScholarCurriculum/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendScholarCurriculum).
        
  #### **NOTE:**  After completing the installation process, the next step is going to the users web page at the route /registerGovernment (for example, PUBLIC_IP:5512/registerGovernment) and register the initial critical user of the system. Then, follow the [User Manual](https://github.com/UPTokenizing/digitalIdentity/UserManual.pdf).

---

### Local Setup

   **Clone the project from the Github: https://github.com/UPTokenizing/digitalIdentity.git**
   ```bash
   git clone https://github.com/UPTokenizing/digitalIdentity.git
   ```
   Now, install following any of the two options: [Manually](https://github.com/UPTokenizing/digitalIdentity?tab=readme-ov-file#Manual-Installation-option) or [Semi-automatic](https://github.com/UPTokenizing/digitalIdentity?tab=readme-ov-file#Semi-Automatic-Installation-option).

 1. **Docker Installation**  
   First, install docker, a guide for that visit [docker install](https://docs.docker.com/engine/install/).   
 2. **Services Installation**  
    * #### Manual Installation option
      - #### Step 1.
        Install **DigitalIdentityImage**, follow the instructions explained in the file README.md within the folder [image/](https://github.com/UPTokenizing/digitalIdentity/tree/main/image).
      - #### Step 2.
        Install **Ganache**, follow the instructions explained in the file README.md within the folder [ganache/](https://github.com/UPTokenizing/digitalIdentity/tree/main/ganache).
      - #### Step 3.
        Install **API-Gateway**, follow the instructions explained in the file README.md within the folder [apigateway/](https://github.com/UPTokenizing/digitalIdentity/tree/main/apigateway).
      - #### Step 4.
        Install **BirthCertificate**, follow the instructions explained in the file README.md within the folder [birthCertificate/](https://github.com/UPTokenizing/digitalIdentity/tree/main/birthCertificate).
      - #### Step 5.
        Install **DigitalIdentity**, follow the instructions explained in the file README.md within the folder [digitalIdentity/](https://github.com/UPTokenizing/digitalIdentity/tree/main/digitalIdentity).
      - #### Step 6.
        Install **Users** module, follow the instructions explained in the file README.md within the folder [users/](https://github.com/UPTokenizing/digitalIdentity/tree/main/users).
      - #### Step 7.
        Install **ScholarCurriculum**, follow the instructions explained in the file README.md within the folder [scholarCurriculum/](https://github.com/UPTokenizing/digitalIdentity/tree/main/scholarCurriculum).
    * #### Semi-Automatic Installation option
      This method spins up all required Docker containers automatically, but you will still need to perform some manual configuration inside each service. 
      - #### Step 1.
        Install **Docker Compose**, in your comand console run the following command:
        **Linux**
        ```bash
        apt  install docker-compose -y
        ```
        **Windows and macOS**
        Docker Compose is included by default with `Docker Desktop`.

        > **NOTE:** You can verify that Docker Compose is installed and working. 
        ```bash 
        docker-compose --version
        ```
    
      - #### Step 2.
        Run the **docker-compose.yml**, in your comand console run the following command:
        ```bash
        sudo docker-compose up -d
        ```
        > **NOTE:** You can undo what the compose did with the next command. 
        ```bash 
        sudo docker-compose down
        ```
    
      - #### Step 3.
        Follow the individual README instructions from the `Go into container <SERVICE NAME> by checking the CONTAINER ID with the following:` in the **Installation Section** to complete the setup after the containers are running.

        - Complete **Ganache** installation: [ganache/](https://github.com/UPTokenizing/digitalIdentity/tree/main/ganache).
        - Complete **API-Gateway** installation: [apigateway/](https://github.com/UPTokenizing/digitalIdentity/tree/main/apigateway).
        - Complete **BirthCertificate** installation: [birthCertificate/](https://github.com/UPTokenizing/digitalIdentity/tree/main/birthCertificate).
        - Complete **DigitalIdentity** installation: [digitalIdentity/](https://github.com/UPTokenizing/digitalIdentity/tree/main/digitalIdentity).
        - Complete **Users** module installation: [users/](https://github.com/UPTokenizing/digitalIdentity/tree/main/users).
        - Complete **ScholarCurriculum** installation: [scholarCurriculum/](https://github.com/UPTokenizing/digitalIdentity/tree/main/scholarCurriculum).
        - **Create the MySQL container**  
          In the following command, you'll need to customize the `--name`, `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, and `MYSQL_PASSWORD` values. The last two parameters contain the login information for MySQL, and `MYSQL_DATABASE` is where the database name is assigned.
          ```bash
          docker run -d --name tokphy-mysql --network TokPhyAppNetwork -e MYSQL_ROOT_PASSWORD=root_pw123 -e MYSQL_DATABASE=tokphydb -e MYSQL_USER=tokuser -e MYSQL_PASSWORD=user_pw123 -p 3306:3306 mysql:8
          ```
        - **Connect MySQL with the frontend**  
          To connect the database directly to the frontend, create a .env file in the root folder of every frontend project (the same directory where the server.js file is located, for example, for project **frontendIdentityDigital** the path is [digitalIdentity/frontendIdentityDigital/frontendDigitalApp/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendIdentityDigital/frontendDigitalApp/)  ) with the following settings (it is based on the past example):
          ```env
          DB_HOST=tokphy-mysql
          DB_USER=tokuser
          DB_PASSWORD=user_pw123
          DB_NAME=tokphydb
          JWT_SECRET=your_secure_secret_key_here
          ```
          > **NOTE:** The JWT secret value is a session token.
        - Complete the **Front-Ends** installation: [frontendBirthCertificate/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendBirthCertificate), [frontendIdentityDigital/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendIdentityDigital), [frontendUsersInteface/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendUsersInteface), and [frontendScholarCurriculum/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendScholarCurriculum).

    ### _The next steps are only if the Service Installation was the manual option._

3. **Create the MySQL container**  
   In the following command, you'll need to customize the `--name`, `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, and `MYSQL_PASSWORD` values. The last two parameters contain the login information for MySQL, and `MYSQL_DATABASE` is where the database name is assigned.
   ```bash
   docker run -d --name tokphy-mysql --network TokPhyAppNetwork -e MYSQL_ROOT_PASSWORD=root_pw123 -e MYSQL_DATABASE=tokphydb -e MYSQL_USER=tokuser -e MYSQL_PASSWORD=user_pw123 -p 3306:3306 mysql:8
   ```
   > **NOTE:** The MySQL container should start running after the *`scholarCurriculum`* container, so in his case it is necessary to stop the container if it is running.
   

4. **Connect MySQL with the frontend**  
   To connect the database directly to the frontend, create a .env file in the root folder of every frontend project (the same directory where the server.js file is located, for example, for project **frontendIdentityDigital** the path is [digitalIdentity/frontendIdentityDigital/frontendDigitalApp/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendIdentityDigital/frontendDigitalApp/)  ) with the following settings (it is based on the past example):
   ```env
   DB_HOST=tokphy-mysql
   DB_USER=tokuser
   DB_PASSWORD=user_pw123
   DB_NAME=tokphydb
   JWT_SECRET=your_secure_secret_key_here
   ```
   > **NOTE:** The JWT secret value is a session token.
   
   > **NOTE:** The MySQL container should start running after the *`scholarCurriculum`* container (This is for the IP assignation).
5. **Front-End Installation**
    Follow the instructions explained in the file README.md within the folders [frontendBirthCertificate/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendBirthCertificate), [frontendIdentityDigital/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendIdentityDigital), [frontendUsersInteface/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendUsersInteface), and [frontendScholarCurriculum/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendScholarCurriculum).
  
  #### **NOTE:**  After completing the installation process, the next step is going to the users web page at the route /registerGovernment (for example, PUBLIC_IP:5512/registerGovernment) and register the initial critical user of the system. Then, follow the [User Manual](https://github.com/UPTokenizing/digitalIdentity/UserManual.pdf).

## Deployment
  Execute the following instructions:    
  1. Follow the **Deployment** instructions explained in file README.md within folder [ganache/](https://github.com/UPTokenizing/digitalIdentity/tree/main/ganache).
  2. Then, follow the **Deployment** instructions explained in file README.md within folder [apigateway/](https://github.com/UPTokenizing/digitalIdentity/tree/main/apigateway).
  3. Next, follow the **Deployment** instructions explained in file README.md within folder [birthCertificate/](https://github.com/UPTokenizing/digitalIdentity/tree/main/birthCertificate).
  4. Following with the **Deployment** instructions explained in file README.md within folder [digitalIdentity/](https://github.com/UPTokenizing/digitalIdentity/tree/main/digitalIdentity).
  5. After digital Identity, follow the **Deployment** instructions explained in file README.md within folder [users/](https://github.com/UPTokenizing/digitalIdentity/tree/main/users).
  6. After digital Identity, follow the **Deployment** instructions explained in file README.md within folder [scholarCurriculum/](https://github.com/UPTokenizing/digitalIdentity/tree/main/scholarCurriculum). **NOTE**
  7. Lastly, follow the **Deployment** instructions explained in file README.md within the folders of for the user interactions [frontendBirthCertificate/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendBirthCertificate), [frontendIdentityDigital/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendIdentityDigital), [frontendUsersInteface/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendUsersInteface), [frontendScholarCurriculum/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendScholarCurriculum).
  
  > **NOTE:** If the project is within a local machine, the MySQL container should start running after the *`scholarCurriculum`* container (This is for the IP assignation).

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
        
