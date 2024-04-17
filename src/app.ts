/**
 * Cesar Guerrero
 * 04/16/2024
 * 
 * @file We are employing the factory pattern when creating our application
 */

import express from "express";
import { DataSource } from "typeorm";

export default function createApp(ENVIRONMENT ?: string){

    const application = express();
    application.use(express.json());
    
    let dataSource; 
    if(ENVIRONMENT === "test"){
        application.set("environment", "test");
        //Test Configuration
        dataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            synchronize: true,
            logging: true,
            dropSchema: true,
            entities: []
        });
    }else{
        application.set("environment", "development");
        //Dev Configuration
        dataSource = new DataSource({
            type: "sqlite",
            database: "dev.db",
            synchronize: true,
            logging: true,
            entities: []
        });
    }


    return application;
}