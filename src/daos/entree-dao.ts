/**
 * Cesar Guerrero
 * 04/17/2024
 * 
 * @file DAO for the Entree Table
 */

import { Repository, DataSource} from "typeorm";
import { Entree } from "../models/entree";

interface EntreeUpdateInterface extends Partial<Entree>{
    entreeID: number
}

/**
 * This class is the Data Access Object for the Entree Table and will be used to interact with the database
 */
export default class EntreeDAO{

    private repository : Repository<Entree>;

    constructor(dataSource: DataSource){
        this.repository = dataSource.getRepository(Entree);
    }

    /**
     * Return all the entree rows in the table
     * @returns - A promise that resolves to an array of all the entrees in the table
     */
    async getAllEntrees(){
        return await this.repository.find();
    };

    /**
     * Attempt to find an entree with the given PK in the table
     * @param {number | undefined} entreeID - The primary key of the entree we want to retrieve
     * @returns - A promise that resolves to the entree object with the given ID
     */
    async getEntreeByID(entreeID: number|undefined){
        return await this.repository.findOne({
            where: {
                entreeID: entreeID
            }
        });
    };

    /**
     * Creates a new entree and attempt to save it to the database
     * @param {Entree} entree - Must contain all of the necessary fields to create a new entree
     * @returns - The object that was created in the database
     */
    async createEntree(entree: Entree){
        const newEntree = this.repository.create(entree);
        if(newEntree.price < 0){
            throw new Error("Price cannot be negative");
        };

        const existingEntree = await this.getEntreeByID(newEntree.entreeID);
        if(existingEntree !== null){
            throw new Error("An entree with that PK already exists");
        }

        return await this.repository.save(newEntree);
    };

    /**
     * Updates an existing entree in the table
     * @param {EntreeUpdateInterface} entree - Contains the primary key of the entree we want to update and the new values
     * @returns - The object that was updated in the database
     */
    async updateEntreeById(entree: EntreeUpdateInterface){
        const existingEntree = await this.getEntreeByID(entree.entreeID);
        if(existingEntree === null){
            throw new Error("Entree does not exist");
        }

        const updatedEntree = {...existingEntree, ...entree};
        if(updatedEntree.price < 0){
            throw new Error("Price cannot be negative");
        }

        return await this.repository.save(entree);
    };

    /**
     * Deletes an entree from the table
     * @param {number | undefined} entreeID - The primary key of the entree we want to delete
     * @returns - The object that was deleted from the database
     */
    async deleteEntreeById(entreeID: number|undefined){
        const entree = await this.getEntreeByID(entreeID);
        if(entree === null){
            throw new Error("Entree does not exist");
        }

        return await this.repository.remove(entree);
    };


    /**
     * Deletes all entrees from the table
     * @returns - An empty promise
     */
    async deleteAllEntrees(){
        return await this.repository.clear();
    };
}