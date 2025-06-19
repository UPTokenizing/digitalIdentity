# Scholar Curriculum Microservice
## General description
  This application contains all services to store information in the Blockchain to the system called Scholar Curriculum. This offers a solution using a microservice architecture.

## Pre-requirements
  Check the network created previously:

    docker network inspect TokPhyAppNetwork

  You must see the network details
 
## Install process
Go to path "digitalIdentity/scholarCurriculum", so-called PATHL, there you can see this readme. Execute the following steps
      
    cd <PATHL>  
    
Create the new image from digitalidentityimage container, first check its id:
  
    sudo docker ps -a

Now you must create the image:      
    
    sudo docker commit <digitaldentityimage Container Id> scholarcurriculum

Run ubuntu: 
      
    sudo docker run -dit --name scholarcurriculum --network TokPhyAppNetwork  -p 5504:5504 -v <PATHL>:/scholarcurriculum   digitalidentityimage

Go into container **scholarcurriculum** by checking the CONTAINER ID with the following:

    sudo docker ps -a
    
    sudo docker exec -it scholarcurriculum /bin/bash

  Then, go to the ubuntu instance path:
      
      cd /scholarcurriculum/scholarCurriculumApp

  You must update some package lists before installing npm:
      sudo apt-get update
  
  Then, Update npm:
      
      npm update

  Change permissions:
      
      chmod 544 startApp

  Execute web server:
      
      ./startApp

  After this, you must see something like this:
    
    > dcertificate@0.0.0 start
    > node ./bin/www

  You can execute ctrl+C to exit

