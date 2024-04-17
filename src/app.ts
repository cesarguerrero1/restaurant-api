/**
 * Cesar Guerrero
 * 04/16/2024
 * 
 * @file We are employing the factory pattern when creating our application
 */

import express from "express";
import "reflect-metadata";
import sqlite3 from "sqlite3";

//TypeORM
import { DataSource } from "typeorm";
import { Entree } from "./models/entree";
import { Appetizer } from "./models/appetizer";
import { Salad } from "./models/salad";

//DAOs
//import { EntreeDAO } from "./dao/entree";
import AppetizerDAO from "./daos/appetizer-dao";
//import { SaladDAO } from "./dao/salad";


export default function createApp(ENVIRONMENT ?: string){

    const application = express();
    application.use(express.json());
    
    let dataSource: DataSource; 
    if(ENVIRONMENT === "test"){
        application.set("environment", "test");
        //Test Configuration
        dataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            synchronize: true,
            logging: true,
            dropSchema: true,
            entities: [Entree, Appetizer, Salad]
        });
    }else{
        application.set("environment", "development");

        const db = new sqlite3.Database("dev.db");

        //Dev Configuration
        dataSource = new DataSource({
            type: "sqlite",
            database: "dev.db",
            synchronize: true,
            logging: true,
            entities: [Entree, Appetizer, Salad]
        });
    }

    //Initialize the database and handle the promise
    dataSource.initialize()
    .then(() => {
        //Pass the datasource to our DAOs
        const appetizerDAO = new AppetizerDAO(dataSource);
        
    })
    .catch((error) => {
        console.timeLog("Error initializing the database");
        process.exit(1);
    });

    return application;
}