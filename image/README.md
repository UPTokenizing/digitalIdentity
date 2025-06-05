# Image instructions
## General description
  This will install the network and image conditions to install all required instances.

## Pre-requirements
  Install a network in docker as follows:

    docker network create --gateway 172.18.1.1 --subnet 172.18.1.0/24 TokPhyAppNetwork
  
  To see the created network:    

    sudo docker network inspect TokPhyAppNetwork
 
## Install process
Go to your computer to the patch "digitalIdentity/image", we will called for now PATHIMAGEN:

    cd <PATHIMAGEN>  
  
There you can see two files: Dockerfile and this readme:

    ls

Download ubuntu image:
      
    sudo docker pull ubuntu:24.04
    
Build the ubuntu image in a repository:
      
      sudo docker build -t digitalidentityimage <PATHIMAGEN>

To see the image created, use the following command:

    sudo docker images

or the equivalent:

    sudo docker image ls

In the list, you can see the image created.

Now, run ubuntu:

    sudo docker run -it digitalidentityimage

  You can exit of this instance:
    
    exit

  and stop it (from the host), first check the id:
    
    sudo docker ps -a

  now, stop it:
    
    sudo docker stop <digitalidentityimageId>

Ready, you have installed the conditions.