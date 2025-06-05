# API Gateway for tokenizing
## General description
  This application is the API Gateway for the digital identity project. This offers a solution to insert various microservices.

## Pre-requirements
  Check the network created previously:

    docker network inspect TokPhyAppNetwork

  You must see the network details
 
## Install process
Go to path "digitalIdentity/apigatewayApp", so-called PATHL, there you can see this readme. Execute the following steps
      
    cd <PATHL>  
    
Create the new image from digitalidentityimage container, first check its id:
  
    sudo docker ps -a

Now you must create the image:      
    
    sudo docker commit <digitaldentityimage Container Id> apigateway

Run ubuntu: 
      
    sudo docker run -dit --name apigateway --network TokPhyAppNetwork -p 5500:5500 -p 9876:9876 -v  <PATHL>:/apigateway  digitalidentityimage

Go into container **apigateway** by checking the CONTAINER ID with the following:

    sudo docker ps -a
    
    sudo docker exec -it <containerid> /bin/bash

Now, you must stay within the ganache's instance, then go to the path:
      
      cd /apigateway/apigatewayApp
  
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
    
    npm start