# Genesis Identity Microservice
## General description
  This application contains all services to store information in the Blockchain to the system called Genesis Identity. This offers a solution using a microservice architecture.

## Pre-requirements
  Althouth it should have been installed previously. Check if you have the network created:    

    $ docker network inspect TokPhyAppNetwork

  If not, install it with:

    $ docker network create --gateway 172.18.1.1 --subnet 172.18.1.0/24 TokPhyAppNetwork

 
## Install process
  Using the Dockerfile located in this repository, execute the following steps:

    * Download this repository in a path in your computer, so-called PATHL
    * Download ubuntu image (althouth this step should not be required because of the previous Ganache installation):
      $ docker pull ubuntu:23.10
    
    * Build the ubuntu image in a repository:
      $ docker build -t genesisidentity  <PATHL>

    * Run ubuntu: 
      $ docker run -it --network TokPhyAppNetwork -p 5501:5501 -v <PATHL>:/genesisidentity  genesisidentity

    * Then, go to the ubuntu instance path:
      $ cd /genesisidentity/genesisidentityApp

    * You must intro to the ubuntu instance and install npm:
      $ sudo apt install nodejs npm
  
    * Then, Update npm:
      $ npm update

    * Change permissions:
      $ chmod 544 startApp

    * Execute web server:
      $ ./startApp
