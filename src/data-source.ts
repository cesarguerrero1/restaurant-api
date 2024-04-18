/**
 * Cesar Guerrero
 * 04/17/2024
 * 
 * @file This file contains the data source configurations for our application
 */

import { DataSource } from "typeorm";
import { Entree } from "./models/entree";
import { Appetizer } from "./models/appetizer";


//Returns a data source where our sqlite database only exists in memory
export const testDataSource = () => {
    return new DataSource({
        type: "sqlite",
        database: ":memory:",
        synchronize: true,
        dropSchema: true,
        entities: [Entree, Appetizer]
    });
}

//Returns a data source where our sqlite database is stored in a file called dev.db
export const devDataSource = () => {
    return new DataSource({
        type: "sqlite",
        database: "dev.db",
        synchronize: true,
        entities: [Entree, Appetizer]
    });
}
