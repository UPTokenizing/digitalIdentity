# Deployment
  Check the containers installed executing the following:
    
    sudo docker ps -a

  Identify the container id of **birthcertificate** and set the following command:
    
    sudo docker start birthcertificate

  Go into container **birthcertificate** by executing the following:
    
    sudo docker exec -it birthcertificate /bin/bash

  Go to the following path:
    
    cd /birthcertificate/birthCertificateApp

  Then, execute the following command:
    
    ./startApp
