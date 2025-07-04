# Local Setup and Installation

   **Clone the project from the GitHub: https://github.com/UPTokenizing/digitalIdentity.git**
   ```bash
   git clone https://github.com/UPTokenizing/digitalIdentity.git
   ```
1. **Docker Installation**  
   First, install docker, a guide for that visit [docker install](https://docs.docker.com/engine/install/).   
 
 2. **Services Installation**  
    Install the services following any of the two options: [Manually](https://github.com/UPTokenizing/digitalIdentity/blob/main/Local-Setup.md#manual-installation-option) or [Automatic](https://github.com/UPTokenizing/digitalIdentity/blob/main/Local-Setup.md#automatic-installation-option).

    * ### Manual Installation option
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
      - #### Step 8.
        **Create the MySQL container**
        - Pull MySQL image
        ```bash
        sudo docker pull mysql:8
        ```
        - In the following command, you'll need to customize the `--name`, `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, and `MYSQL_PASSWORD` (Do not use \" or "#") values. The last two parameters contain the login information for MySQL, and `MYSQL_DATABASE` is where the database name is assigned.
        ```bash
        docker run -d --name tokphy-mysql --network TokPhyAppNetwork -e MYSQL_ROOT_PASSWORD=root_pw123 -e MYSQL_DATABASE=tokphydb -e MYSQL_USER=tokuser -e MYSQL_PASSWORD=user_pw123 -p 3306:3306 mysql:8
        ```
        > **NOTE:** The MySQL container should start running after the *`scholarCurriculum`* container, so in his case it is necessary to stop the container if it is running.
        
      - #### Step 9.
        **Connect MySQL with the frontend**  
        To connect the database directly to the frontend, create a .env file in the root folder of every frontend project (the same directory where the server.js file is located, for example, for project **frontendIdentityDigital** the path is [digitalIdentity/frontendIdentityDigital/frontendDigitalApp/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendIdentityDigital/frontendDigitalApp/)  ) with the following settings (it is based on the past example, Do not use \" or "#" for passwords):
        ```env
        DB_HOST=tokphy-mysql
        DB_USER=tokuser
        DB_PASSWORD="user_pw123"
        DB_NAME=tokphydb
        JWT_SECRET=your_secure_secret_key_here
        ```
        > **NOTE:** The JWT secret value is a session token. Ex: M1_53cuR3_K3Y
        
        > **NOTE:** The MySQL container should start running after the *`scholarCurriculum`* container (This is for the IP assignation).

      - #### Step 10.
        **Front-End Installation**
          Follow the instructions explained in the file README.md within the folders [frontendBirthCertificate/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendBirthCertificate), [frontendIdentityDigital/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendIdentityDigital), [frontendUsersInteface/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendUsersInteface), and [frontendScholarCurriculum/](https://github.com/UPTokenizing/digitalIdentity/tree/main/frontendScholarCurriculum).
      - #### Step 11.
        Continue with [Deployment](https://github.com/UPTokenizing/digitalIdentity/blob/main/README.md#deployment)


    * ### Automatic Installation option
       
      - #### Step 1.
        Install **Docker Compose** and the mysql image, in your command console, run the following command:
        **Linux**
        ```bash
        cd digitalIdentity
        apt  install docker-compose -y
        sudo docker pull mysql:8
        ```
        **Windows and macOS**
        Docker Compose is included by default with `Docker Desktop`.

        > **NOTE:** You can verify that Docker Compose is installed and working. 
        ```bash 
        docker-compose --version
        ```
    
      - #### Step 2.
        Run the script **setup_local_containers**, in your command console, run the following commands:
        **Linux / MacOS**
        ```bash
        sudo chmod 544 setup_local_containers.sh
        sudo ./setup_local_containers.sh
        ```
        
        **Windows (Powershell terminal)**
        ```bash
        .\setup_local_containers.ps1
        ```
        
        **ARM architecture (e.g, MacOS no Intel)**
        ```bash
        sudo chmod 544 setup_local_ARM_containers.sh
        sudo ./setup_local_ARM_containers.sh
        ```
        ---
        > **NOTE:** You can undo what the script did with the next commands (all containers have to be stopped).
        
        **Linux / MacOS**
        ```bash 
        sudo docker rm <DB_HOST>
        sudo docker-compose down
        sudo find . -name ".setup_done" -delete
        ```
        
        **Windows (Powershell terminal)**
        ```bash 
        docker rm <DB_HOST>
        docker-compose down
        Get-ChildItem -Recurse -Filter ".setup_done" | Remove-Item -Force
        ```
      - #### Step 3.
        Continue with [Deployment](https://github.com/UPTokenizing/digitalIdentity/blob/main/README.md#deployment)
        
