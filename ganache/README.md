# Blockchain instance for Tokenizing Physical Objets Application
## General description
  This will install the blockchain instance, which will store the transactions of TokPhyApp. We have used Ganache application (part of the Truffle Suite). We have not modified anything of Ganache.

## Pre-requirements
  Check the network created previously:

    docker network inspect TokPhyAppNetwork

  You must see the network details
 
## Install process
Go to path "digitalIdentity/ganache", so-called PATHL, there you can see this readme. Execute the following steps
      
      cd PATHL  
  
Create the new image from digitalidentityimage container, first check its id:
  
    sudo docker ps -a

Now you must create the image:      
    
    sudo docker commit <digitaldentityimage Container Id> ganache

Run ubuntu: 
      
    sudo docker run -dit --name ganache --network TokPhyAppNetwork -p 8546:8546 -v <PATHL>:/tokPhyApp/ganache digitalidentityimage

Go into container **ganache** by checking the CONTAINER ID with the following:

    sudo docker ps -a
    
    sudo docker exec -it <containerid> /bin/bash

  Now, you must stay within the ganache's instance, then go to the path as follows:
  
      cd /tokPhyApp/ganache

  You must intro to the ubuntu instance and install ganche:
      
    // Use the following in Windows OS or Linux
    npm install ganache --global

    // Use the following in MAC OS intel cpu
    npm install -g ganache-cli 

  Update npm:
      
      npm update

  Change permissions:
      
      chmod 544 startApp

  Execute the following command:
      
      ./startApp

  You must obtain the following result at the end of the console:
      
      RPC Listening on 172.18.1.2:8546

  You can execute ctrl+C to exit

## Deployment
  Check the containers installed executing the following:
      
      sudo docker ps -a

  Identify the container id of **ganacheimage** and set the following command:
      
      sudo docker start <containerid>

  Go into container **ganacheimage** by executing the following:
      
      sudo docker exec -it <containerid> /bin/bash

  Then, execute the following command:
      
      /tokPhyApp/ganache/startApp

