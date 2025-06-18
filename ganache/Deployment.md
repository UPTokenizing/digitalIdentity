# Deployment
  Check the containers installed executing the following:
      
      sudo docker ps -a

  Identify the container id of **ganacheimage** and set the following command:
      
      sudo docker start ganache

  Go into container **ganacheimage** by executing the following:
      
      sudo docker exec -it ganache /bin/bash

  Then, execute the following command:
      
      /tokPhyApp/ganache/startApp
