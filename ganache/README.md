# Blockchain instance for Tokenizing Physical Objets Application
## General description
  This will install the blockchain instance, which will store the transactions of TokPhyApp. We have used Ganache application (part of the Truffle Suite). We have not modified anything of Ganache.

## Pre-requirements
  It is required to have created a network in docker as follows:

    $ docker network create --gateway 172.18.1.1 --subnet 172.18.1.0/24 TokPhyAppNetwork
  
  To see the created network:    

    $ docker network inspect TokPhyAppNetwork
 
## Install process
  Using the Dockerfile located in this repository, execute the following steps:

    * Download this repository in a path in your computer, so-called PATHLBLOCKCHAIN
    * Download ubuntu image:
      $ sudo docker pull ubuntu:23.10
    
    * If you are running docker in MacOS, disable line 22 and enable line 25 in the Dockerfile in PATHLBLOCKCHAIN

    * Build the ubuntu image in a repository:
      $ sudo docker build -t ganacheimage  <PATHLBLOCKCHAIN>

    * Run ubuntu: 
      $ sudo docker run -it --network TokPhyAppNetwork -p 8546:8546 -v <PATHLBLOCKCHAIN>:/tokPhyApp/ganache  ganacheimage

    * Then, go to the path:
      $ cd /tokPhyApp/ganache

    * Update npm:
      $ npm update

    * Change permissions:
      $ chmod 544 startApp

    * Execute the following command:
      $ ./startApp

  You must obtain the following result at the end of the console:
    RPC Listening on 172.18.1.2:8546

  You can execute <ctrl>+C to exit

## Deployment
  Check the containers installed executing the following:
      * sudo docker ps -a

  Identify the container id of **ganacheimage** and set the following command:
      * sudo docker start <containerid>

  Go into container **ganacheimage** by executing the following:
      * sudo docker exec -it <containerid> /bin/bash

  Then, execute the following command:
      * /tokPhyApp/ganache/startApp
