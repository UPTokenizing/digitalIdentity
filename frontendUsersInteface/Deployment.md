# Deployment
  
  Check the containers installed by executing the following:
    
    sudo docker ps -a

  Identify the container ID of **frontendusersinterface** and set the following command:
    
    sudo docker start frontendusersinterface

  Go into the container **frontendusersinterface** by executing the following:
    
    sudo docker exec -it frontendusersinterface /bin/bash

  Go to the following path:
    
    cd frontendusersinterface/frontendUsersApp/

  Then, execute the following command:
    
    ./startApp
