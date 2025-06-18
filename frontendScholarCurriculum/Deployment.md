# Deployment
  
  Check the containers installed by executing the following:
    
    sudo docker ps -a

  Identify the container ID of **frontendscholarcurriculum** and set the following command:
    
    sudo docker start frontendscholarcurriculum

  Go into the container **frontendscholarcurriculum** by executing the following:
    
    sudo docker exec -it frontendscholarcurriculum /bin/bash

  Go to the following path:
    
    cd frontendscholarcurriculum/frontendScholarCurriculumApp/

  Then, execute the following command:
    
    ./startApp
