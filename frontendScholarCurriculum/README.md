# Front-End for tokenizing
## General description
  This application is the Front-End for the digital identity project. This offers a solution to have a interactive interface.

## Pre-requirements
  Check the network created previously:

    docker network inspect TokPhyAppNetwork

  You must see the network details
 
## Install process
Go to path "digitalIdentity/frontendScholarCurriculum", so-called PATHL, there you can see this readme. Execute the following steps
      
    cd <PATHL>  
    
Create the new image from digitalidentityimage container, first check its id:
  
    sudo docker ps -a

Now you must create the image:      
    
    sudo docker commit <digitaldentityimage Container Id> frontendscholarcurriculum

Run ubuntu: 
      
    sudo docker run -dit --name frontendscholarcurriculum --network TokPhyAppNetwork  -p 5513:5513  -v  <PATHL>:/frontendscholarcurriculum   digitalidentityimage

Go into container **frontendscholarcurriculum** by checking the CONTAINER ID with the following:

    sudo docker ps -a
    
    sudo docker exec -it frontendscholarcurriculum /bin/bash

  Then, go to the ubuntu instance path:
      
      cd frontendscholarcurriculum/frontendScholarCurriculumApp/

  You must update and upgrade the system before any installation:

      sudo apt-get update && apt-get upgrade -y
      sudo apt install libcurl4-openssl-dev
  
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

