FROM ubuntu:24.04

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
RUN apt-get install npm -y

#Use the following in Windows OS
RUN npm install ganache --global

#Use the following in MAC OS intel cpu
#RUN npm install -g ganache-cli 
