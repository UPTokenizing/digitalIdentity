# AWS Setup and Installation
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