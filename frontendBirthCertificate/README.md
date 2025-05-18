# Front-End for tokenizing
## General description
  This application is the Front-End for the digital identity project. This offers a solution to have an interactive interface.

## Pre-requirements
  Although it should have been installed previously. Check if you have the network created:

    
      docker network inspect TokPhyAppNetwork

  If not, install it with:

    
      docker network create --gateway 172.18.1.1 --subnet 172.18.1.0/24 TokPhyAppNetwork

 
## Install process
  Download this repository to a path on your computer, so-called PATHL, from now on.  Execute the following steps: 

  Go to the following patch:
      
      cd PATHL  
  You must see Dockerfile, README.md file, and folder frontendBirthCertificateApp:
      
      ls 
  Download ubuntu image (although this step should not be required because of the previous Ganache installation):
      
      sudo docker pull ubuntu:24.04
    
  Build the ubuntu image in a repository:
      
      sudo docker build -t frontendbirthcertificate  <PATHL>

  Run ubuntu: 
      
      sudo docker run -it --network TokPhyAppNetwork -p 5510:5510  -v  <PATHL>:/frontendbirthcertificate  frontendbirthcertificate
      

  Then, go to the path:
      
      cd frontendbirthcertificate/frontendBirthCertificateApp/

  You must update and upgrade the system before any installation:

      sudo apt-get update && apt-get upgrade -y
      sudo apt install libcurl4-openssl-dev

  You must intro to the ubuntu instance and install npm:
      
      sudo apt install nodejs npm -y
  
  Then, Update npm:
      
      sudo npm update
  
  Also you nedd to install nodemon and extra dependecies:
      
     sudo npm install nodemon

     sudo npm install axios dotenv bcrypt jsonwebtoken mysql2

     
  Change permissions:
      
      chmod 544 startApp

  Execute web server:
      
      ./startApp
  
  After this, you must see something like this:
    
    > nodeapp@1.0.0 live
    > nodemon server.js

    [nodemon] 3.1.4
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching path(s): *.*
    [nodemon] watching extensions: js,mjs,cjs,json
    [nodemon] starting `node server.js`
    Server is running on port 5510
    

  You can execute Ctrl + C to exit

## Deployment
  
  Check the containers installed by executing the following:
    
    sudo docker ps -a

  Identify the container ID of **frontendbirthcertificate** and set the following command:
    
    sudo docker start <containerid>

  Go into the container **frontendbirthcertificate** by executing the following:
    
    sudo docker exec -it <containerid> /bin/bash

  Go to the following path:
    
    cd frontendbirthcertificate/frontendBirthCertificateApp/

  Then, execute the following command:
    
    ./startApp
