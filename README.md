# Restaurant API

# Overview

# System Design

# Database Design

# Testing

# Project Replication

In order to run this program you will need to install NodeJS onto your computer. Any version past V18 will work. The download page is provided for convenience (https://nodejs.org/en/download)

Once you have NodeJS installed simply follow the instructions below:

1. Clone the github repository onto your machine

2. Use the terminal to navigate to the directory where the files were cloned and run ```npm install``` in order to download all the required dependencies

3. Once the dependencies are installed you can start the server one of two ways
    - You can run ```npm run start``` which will trigger Node to precompile all of the Typescript into Javascript before the server is started. Unlike the option below, changes to the codebase will not force the server to restart
    
    - You can run ```npm run dev``` which will instead trigger Node to compile all of the files at runtime. This option uses ```nodemon``` so any changes to the codebase will automatically restart the server

4. With that your instance should be up and running and the server can be reached at http://localhost:4000