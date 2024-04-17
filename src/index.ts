/**
 * Cesar Guerrero
 * 04/16/2024
 * 
 * @file Entry point into our program
 */

import express, { Response, Request } from 'express';

import createApp from './app';

import { buildSchema } from 'type-graphql';
import { createHandler } from 'graphql-http';
import { ruruHTML } from 'ruru/server';

//Resolvers
import AppetizerResolver from './resolvers/appetizer-resolver';

async function main(){

    const schema = await buildSchema({
        resolvers: [AppetizerResolver],
        emitSchemaFile: true //Creates schema.graphql file in current directory
    });

    if(!schema){
        console.log("Error creating schema");
        process.exit(1);
    }

    //We don't provide any argument which means this will be a development environment
    const app = await createApp();

    //Handle graphql requests - In Porduction this should be POST
    app.all('/graphql', (req: Request, res: Response) => {
        createHandler({
            schema: schema
        })
    });

    //We want to deploy a GraphiQL interface for development purposes
    app.get("/", (req: Request, res: Response) => {
        res.type("html")
        res.end(ruruHTML({ endpoint: "/graphql" }))
    });

    //Server listens on port 4000
    app.listen(4000);
    console.log("Running a GraphQL API server at http://localhost:4000/graphql");
}

//Start the server
main();