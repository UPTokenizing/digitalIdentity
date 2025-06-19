# Deployment
  Check the containers installed executing the following:
    
    sudo docker ps -a

  Identify the container id of **digitalidentity** and set the following command:
    
    sudo docker start digitalidentity

  Go into container **digitalidentity** by executing the following:
    
    sudo docker exec -it digitalidentity /bin/bash

  Go to the following path:
    
    cd digitalidentity/digitaldentityApp/

  Then, execute the following command:
    
    ./startApp
