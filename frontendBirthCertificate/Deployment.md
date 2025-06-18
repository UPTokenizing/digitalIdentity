# Deployment
  
  Check the containers installed by executing the following:
    
    sudo docker ps -a

  Identify the container ID of **frontendbirthcertificate** and set the following command:
    
    sudo docker start frontendbirthcertificate

  Go into the container **frontendbirthcertificate** by executing the following:
    
    sudo docker exec -it frontendbirthcertificate /bin/bash

  Go to the following path:
    
    cd frontendbirthcertificate/frontendBirthCertificateApp/

  Then, execute the following command:
    
    ./startApp
