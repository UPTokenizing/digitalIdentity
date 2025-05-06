# Front-End for tokenizing
## General description
  This application is the Front-End for the digital identity project. This offers a solution to have a interactive interface.

## Pre-requirements
  Althouth it should have been installed previously. Check if you have the network created:

    
      docker network inspect TokPhyAppNetwork

  If not, install it with:

    
      docker network create --gateway 172.18.1.1 --subnet 172.18.1.0/24 TokPhyAppNetwork

 
## Install process
  Download this repository in a path in your computer, so-called PATHL from now on.  Execute the following steps: 

  Go the following patch:
      
      cd PATHL  
  You must see Dockerfile, README.md file and folder frontendScholarCurriculumApp:
      
      ls 
  Download ubuntu image (althouth this step should not be required because of the previous Ganache installation):
      
      sudo docker pull ubuntu:24.04
    
  Build the ubuntu image in a repository:
      
      sudo docker build -t frontendscholarcurriculum  <PATHL>

  Run ubuntu: 
      
      sudo docker run -it --network TokPhyAppNetwork -p 5513:5513  -v  <PATHL>:/frontendscholarcurriculum  frontendscholarcurriculum
      

  Then, go to the path:
      
      cd frontendscholarcurriculum/frontendScholarCurriculumApp/

  You must update and upgrade the system before any isntallation:

      sudo apt-get update && apt-get upgrade -y

  You must intro to the ubuntu instance and install npm:
      
      sudo apt install nodejs npm -y
  
  Then, Update npm:
      
      sudo npm update
  
  
  Also you need to install nodemon, firebase and axios:
      
     sudo npm install nodemon axios firebase

     
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
    

  You can execute ctrl+C to exit

## Deployment
  
  Check the containers installed executing the following:
    
    sudo docker ps -a

  Identify the container id of **frontendscholarcurriculum** and set the following command:
    
    sudo docker start <containerid>

  Go into container **frontendscholarcurriculum** by executing the following:
    
    sudo docker exec -it <containerid> /bin/bash

  Go to the following path:
    
    cd frontendscholarcurriculum/frontendScholarCurriculumApp/

  Then, execute the following command:
    
    ./startApp
