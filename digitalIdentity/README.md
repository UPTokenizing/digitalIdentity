# Digital Identity Microservice
## General description
  This application contains all services to store information in the Blockchain to the system called Digital Identity. This offers a solution using a microservice architecture.

## Pre-requirements
  Althouth it should have been installed previously. Check if you have the network created:    

    docker network inspect TokPhyAppNetwork

  If not, install it with:

    docker network create --gateway 172.18.1.1 --subnet 172.18.1.0/24 TokPhyAppNetwork

 
## Install process
  Download this repository in a path in your computer, so-called PATHL from now on.  Execute the following steps: 

  Go to the following path:
      
      cd PATHL  
  
  You must see Dockerfile, README.md file, folder digitaldentityApp and digitaldentityServices.pdf:
      
      ls 
  
  Download ubuntu image (althouth this step should not be required because of the previous Ganache installation):
      
      docker pull ubuntu:24.04
    
  Build the ubuntu image in a repository:
      
      docker build -t digitaldentity  <PATHL>

  Run ubuntu: 
      
      docker run -it --network TokPhyAppNetwork -p 5502:5502 -v <PATHL>:/digitaldentity  digitaldentity

  Then, go to the ubuntu instance path:
      
      cd /digitaldentity/digitaldentityApp

  You must intro to the ubuntu instance and install npm:
      
      sudo apt install nodejs npm
  
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

  Identify the container id of **digitaldentity** and set the following command:
    
    sudo docker start <containerid>

  Go into container **digitaldentity** by executing the following:
    
    sudo docker exec -it <containerid> /bin/bash

  Go to the following path:
    
    cd /digitaldentity/digitaldentityApp

  Then, execute the following command:
    
    ./startApp
