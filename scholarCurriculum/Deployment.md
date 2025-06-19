# Deployment
  Check the containers installed executing the following:
    
    sudo docker ps -a

  Identify the container id of **scholarcurriculum** and set the following command:
    
    sudo docker start scholarcurriculum

  Go into container **scholarcurriculum** by executing the following:
    
    sudo docker exec -it scholarcurriculum /bin/bash

  Go to the following path:
    
    cd /scholarcurriculum/scholarCurriculumApp

  Then, execute the following command:
    
    ./startApp
