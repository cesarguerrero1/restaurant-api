/**
 * Cesar Guerrero
 * 04/16/2024
 * 
 * @file Entry point into our program
 */

import express, { Response, Request } from 'express';

import createApp from './app';

import { buildSchema } from 'type-graphql';
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from 'ruru/server';

//DAOs
import EntreeDAO from "./daos/entree-dao";
import AppetizerDAO from "./daos/appetizer-dao";

//Resolvers
import AppetizerResolver from './resolvers/appetizer-resolver';

async function main(){

    //We don't provide any argument which means this will be a development environment
    const app = await createApp();

    const serverSchema = await buildSchema({
        resolvers: [AppetizerResolver],
        emitSchemaFile: true, //Creates schema.graphql file in current directory
        validate: { forbidUnknownValues: false } //Since we are not using class-validators we can set this to false
    });

    if(!serverSchema){
        console.log("Error creating schema");
        process.exit(1);
    }

    //Create our DAOs to handle database logic
    const appetizerDAO = new AppetizerDAO(app.get("dataSource"));
    const entreeDAO = new EntreeDAO(app.get("dataSource"));    

    //Handle graphql requests - In Porduction this should be POST
    app.all("/graphql", createHandler({
        schema: serverSchema,
        context: () => ({
            appetizerDAO,
            entreeDAO
        })
    }));

    //We want to deploy a GraphiQL interface for development purposes
    app.get("/", (req: Request, res: Response) => {
        res.type("html")
        res.end(ruruHTML({ endpoint: "/graphql" }))
    });

    //Server listens on port 4000
    app.listen(4000);
    console.log("Running a GraphQL API server at http://localhost:4000");
}

//Start the server
main();