# Deployment
  Check the containers installed executing the following:
    
    sudo docker ps -a

  Identify the container id of **users** and set the following command:
    
    sudo docker start users

  Go into container **users** by executing the following:
    
    sudo docker exec -it users /bin/bash

  Go to the following path:
    
    cd /users/usersApp

  Then, execute the following command:
    
    ./startApp
