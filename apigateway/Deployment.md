# Deployment
  
  Check the containers installed executing the following:
    
    sudo docker ps -a

  Identify the container id of **apigateway** and set the following command:
    
    sudo docker start apigateway

  Go into container **apigateway** by executing the following:
    
    sudo docker exec -it apigateway /bin/bash

  Go to the following path:
    
    cd /apigateway/apigatewayApp/

  Then, execute the following command:
    
    npm start
