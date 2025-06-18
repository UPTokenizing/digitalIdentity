# Deployment
  
  Check the containers installed by executing the following:
    
    sudo docker ps -a

  Identify the container ID of **frontendidentitydigital** and set the following command:
    
    sudo docker start frontendidentitydigital

  Go into the container **frontendidentitydigital** by executing the following:
    
    sudo docker exec -it frontendidentitydigital /bin/bash

  Go to the following path:
    
    cd frontendidentitydigital/frontendDigitalApp/

  Then, execute the following command:
    
    ./startApp
