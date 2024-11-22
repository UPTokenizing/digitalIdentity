# API Gateway for tokenizing
## General description
  This application is the API Gateway for the digital identity project. This offers a solution to insert various microservices.

## Pre-requirements
  Althouth it should have been installed previously. Check if you have the network created:

    
      docker network inspect TokPhyAppNetwork

  If not, install it with:

    
      docker network create --gateway 172.18.1.1 --subnet 172.18.1.0/24 TokPhyAppNetwork

 
## Install process
  Download this repository in a path in your computer, so-called PATHL from now on.  Execute the following steps: 

  Go the following patch:
      
      cd PATHL  
  You must see Dockerfile, README.md file and folder apigatewayApp:
      
      ls 
  Download ubuntu image (althouth this step should not be required because of the previous Ganache installation):
      
      sudo docker pull ubuntu:23.10
    
  Build the ubuntu image in a repository:
      
      sudo docker build -t apigateway  <PATHL>

  Run ubuntu: 
      
      sudo docker run -it --network TokPhyAppNetwork -p 5500:5500 -p 9876:9876 -v  <PATHL>:/apigateway  apigateway

  Now, you must stay within the ganache's instance, then go to the path:
      
      cd /apigateway/apigatewayApp

  You must intro to the ubuntu instance and install npm:
      
      sudo apt install nodejs npm
  
  Then, Update npm:
      
      npm update

  Change permissions:
      
      chmod 544 startApp

  Execute web server:
      
      ./startApp
  
  After this, you must see something like this:
    
    [EG:gateway] info: gateway http server listening on :::5500
    [EG:admin] info: admin http server listening on ::1:9876

  You can execute ctrl+C to exit

## Deployment
  
  Check the containers installed executing the following:
    
    sudo docker ps -a

  Identify the container id of **apigateway** and set the following command:
    
    sudo docker start <containerid>

  Go into container **apigateway** by executing the following:
    
    sudo docker exec -it <containerid> /bin/bash

  Go to the following path:
    
    cd /apigateway/apigatewayApp/

  Then, execute the following command:
    
    ./startApp
