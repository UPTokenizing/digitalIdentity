# User Identity Microservice
## General description
  This application contains all services to store information in the Blockchain to the system called Users. This offers a solution using a microservice architecture.

## Pre-requirements
  Althouth it should have been installed previously. Check if you have the network created:    

    docker network inspect TokPhyAppNetwork

  If not, install it with:

    docker network create --gateway 172.18.1.1 --subnet 172.18.1.0/24 TokPhyAppNetwork

 
## Install process
  Download this repository in a path in your computer, so-called PATHL from now on.  Execute the following steps: 

  Go to the following path:
      
      cd PATHL  
  
  You must see Dockerfile, README.md file, folder usersApp and usersServices.pdf:
      
      ls 
  
  Download ubuntu image (althouth this step should not be required because of the previous Ganache installation):
      
      docker pull ubuntu:plucky-20241111
    
  Build the ubuntu image in a repository:
      
    sudo docker build -t users  <PATHL>

  Run ubuntu: 
      
    sudo docker run -it --network TokPhyAppNetwork -p 5503:5503 -v <PATHL>:/users  users

  Then, go to the ubuntu instance path:
      
      cd /users/usersApp

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

  Identify the container id of **users** and set the following command:
    
    sudo docker start <containerid>

  Go into container **users** by executing the following:
    
    sudo docker exec -it <containerid> /bin/bash

  Go to the following path:
    
    cd /users/usersApp

  Then, execute the following command:
    
    ./startApp
