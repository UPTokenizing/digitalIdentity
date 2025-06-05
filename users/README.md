# User Identity Microservice
## General description
  This application contains all services to store information in the Blockchain to the system called Users. This offers a solution using a microservice architecture.

## Pre-requirements
  Check the network created previously:

    docker network inspect TokPhyAppNetwork

  You must see the network details
 
## Install process
Go to path "digitalIdentity/users", so-called PATHL, there you can see this readme. Execute the following steps
      
    cd <PATHL>  
    
Create the new image from digitalidentityimage container, first check its id:
  
    sudo docker ps -a

Now you must create the image:      
    
    sudo docker commit <digitaldentityimage Container Id> users

Run ubuntu: 
      
    sudo docker run -dit --name users --network TokPhyAppNetwork  -p 5503:5503 -v <PATHL>:/users  digitalidentityimage

Go into container **users** by checking the CONTAINER ID with the following:

    sudo docker ps -a
    
    sudo docker exec -it <containerid> /bin/bash

  Then, go to the ubuntu instance path:
      
      cd /users/usersApp
  
  Then, Update npm:
      
      npm update

  Change permissions:
      
      chmod 544 startApp

  Execute web server:
      
      ./startApp

  After this, you must see something like this:
    
    > didentity@0.0.0 start
    > node ./bin/www

  You can execute ctrl+C to exit

## Deployment
  Check the containers installed executing the following:
    
    sudo docker ps -a

  Identify the container id of **users** and set the following command:
    
    sudo docker start <containerid>

  Go into container **users** by executing the following:
    
    sudo docker exec -it <containerid> /bin/bash

  Go to the following path:
    
    cd /users/usersApp

  Then, execute the following command:
    
    ./startApp
