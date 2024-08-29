FROM ubuntu:23.10

RUN apt-get update
RUN apt-get install sudo -y

RUN apt-get upgrade -y

RUN apt-get update 

#Install curl
RUN apt-get install curl -y

#Install network utils
RUN apt-get update
RUN apt-get install net-tools
RUN apt-get install iputils-ping -y

#Install node
RUN apt-get install -y nodejs

RUN apt-get upgrade -y

RUN apt-get update