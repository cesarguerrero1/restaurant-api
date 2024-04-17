/**
 * Cesar Guerrero
 * 04/16/2024
 * 
 * @file Entry point into our program
 */

import express, { Response, Request } from 'express';

import createApp from './app';

async function main(){
    /**
     * Handling building the graphql schema here
     */

    //We don't provide any argument which means this will be a development environment
    const app = createApp();

    /**
     * Handling the graphql queries here
     */

    //Server listens on port 4000
    app.listen(4000);
}

//Start the server
main();
