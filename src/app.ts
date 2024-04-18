/**
 * Cesar Guerrero
 * 04/16/2024
 * 
 * @file We are employing the factory pattern when creating our application
 */

import express from "express";
import fs from "fs";
import "reflect-metadata";
import sqlite3 from "sqlite3";

//TypeORM
import { DataSource } from "typeorm";
import { testDataSource, devDataSource } from "./data-source";

/**
 * In order to implement a Factory Design pattern the application configuration needs to be changed based on a parameter, in this case the environment
 * @param {string} ENVIRONMENT - The environment in which the application is running
 * @returns - An express application
 */
export default async function createApp(ENVIRONMENT ?: string){

    const application = express();
    application.use(express.json());
    
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