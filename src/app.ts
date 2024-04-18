/**
 * Cesar Guerrero
 * 04/16/2024
 * 
 * @file We are employing the factory pattern when creating our application
 */
import express, { Response, Request } from 'express';
import fs from "fs";
import "reflect-metadata";
import sqlite3 from "sqlite3";

//TypeORM
import { DataSource } from "typeorm";
import { testDataSource, devDataSource } from "./data-source";

//GraphQL
import { buildSchema } from 'type-graphql';
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from 'ruru/server';

//DAOs
import EntreeDAO from "./daos/entree-dao";
import AppetizerDAO from "./daos/appetizer-dao";

//Resolvers
import AppetizerResolver from './resolvers/appetizer-resolver';
import EntreeResolver from './resolvers/entree-resolver';


/**
 * In order to implement a Factory Design pattern the application configuration needs to be changed based on a parameter, in this case the environment
 * @param {string} ENVIRONMENT - The environment in which the application is running
 * @returns - An express application
 */
export async function createApp(ENVIRONMENT ?: string){

    const application = express();
    application.use(express.json());
    
    //Factory Design Pattern
    let dataSource: DataSource; 
    if(ENVIRONMENT === "test"){
        application.set("environment", "test");
        //Test Configuration
        dataSource = testDataSource();
    }else{
        application.set("environment", "development");

        //Remove the database file if it exists
        if(fs.existsSync("dev.db")){
            fs.unlinkSync("dev.db");
        }
        const db = new sqlite3.Database("dev.db");

        //Dev Configuration
        dataSource = devDataSource();
    }

    //Check to see if a connection exists before we attempt to connect to the database
    if(dataSource.isInitialized){
        await dataSource.destroy();
    }

    await dataSource.initialize();
    if(!dataSource.isInitialized){
        console.log("Error initializing the database");
        process.exit(1);
    }

    application.set("dataSource", dataSource);

    return application;
}


/**
 * In order to test the graphql endpoint we need to create an instance of the application and then configure everything
 * @param {express.Express} application - The express application
 */
export async function configureGraphQL(application: express.Express){

    const serverSchema = await buildSchema({
        resolvers: [AppetizerResolver, EntreeResolver],
        emitSchemaFile: true, //Creates schema.graphql file in current directory
        validate: { forbidUnknownValues: false } //Since we are not using class-validators we can set this to false
    });

    if(!serverSchema){
        console.log("Error creating schema");
        process.exit(1);
    }

    //Create our DAOs to handle database logic
    const appetizerDAO = new AppetizerDAO(application.get("dataSource"));
    const entreeDAO = new EntreeDAO(application.get("dataSource"));    

    //Handle graphql requests - In Porduction this should be POST
    application.all("/graphql", createHandler({
        schema: serverSchema,
        context: () => ({
            appetizerDAO,
            entreeDAO
        })
    }));

    //We want to deploy a GraphiQL interface for development purposes
    application.get("/", (req: Request, res: Response) => {
        res.type("html")
        res.end(ruruHTML({ endpoint: "/graphql" }))
    });
}