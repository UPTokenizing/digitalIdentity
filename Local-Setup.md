# Local Setup and Installation

   **Clone the project from the Github: https://github.com/UPTokenizing/digitalIdentity.git**
   ```bash
   git clone https://github.com/UPTokenizing/digitalIdentity.git
   ```
   Now, install following any of the two options: [Manually](https://github.com/UPTokenizing/digitalIdentity?tab=local-setup-ov-file#Manual-Installation-option) or [Semi-automatic](https://github.com/UPTokenizing/digitalIdentity?tab=local-setup-ov-file#Semi-Automatic-Installation-option).

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
  
  #### **NOTE:**  After completing the installation process, the next step is going to the users web page at the route /registerGovernment (for example, PUBLIC_IP:5512/registerGovernment) and register the initial critical user of the system. Then, follow the [User Manual](https://github.com/UPTokenizing/digitalIdentity/blob/main/UserManual.pdf).