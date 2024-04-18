/**
 * Cesar Guerrero
 * 04/17/2024
 * 
 * @file DAO for the Appetizer Table
 */

import { Repository, DataSource} from "typeorm";
import { Appetizer } from "../models/appetizer";


//We are going to be using the Partial type to make all the fields in the Appetizer model optional
interface AppetizerUpdateInterface extends Partial<Appetizer>{
    appetizerID: number
}

/**
 * This class is the Data Access Object for the Appetizer Table and will be used to interact with the database
 */
export default class AppetizerDAO{

    //We are going to be using a repository to interact with the table in the database
    private repository : Repository<Appetizer>;

    constructor(dataSource: DataSource){
        this.repository = dataSource.getRepository(Appetizer);
    }

    /**
     * Return all the appetizer rows in the table
     * @returns - A promise that resolves to an array of all the appetizers in the table
     */
    async getAllAppetizers(){
        return await this.repository.find();
    };

    /**
     * Attempt to find an appetizer with the given PK in the table
     * @param {number | undefined} appetizerID - The primary key of the appetizer we want to retrieve
     * @returns - A promise that resolves to the appetizer object with the given ID
     */
    async getAppetizerByID(appetizerID: number|undefined){
        return await this.repository.findOne({
            where: {
                appetizerID: appetizerID
            }
        });
    };

    /**
     * Creates a new appetizer and attempt to save it to the database
     * @param {Appetizer} appetizer - Must contain all of the necessary fields to create a new appetizer
     * @returns - The object that was created in the database
     */
    async createAppetizer(appetizer: Appetizer){
        const newAppetizer = this.repository.create(appetizer);
        if(newAppetizer.price < 0){
            throw new Error("Price cannot be negative");
        }
        
        //We do not want to allow creation of appetizers with the same PK
        const existingAppetizer = await this.getAppetizerByID(newAppetizer.appetizerID);
        if(existingAppetizer !== null){
            throw new Error("An appetizer with that PK already exists");
        }
        return await this.repository.save(newAppetizer);
    }

    /**
     * Updates a given appetizer in the table
     * @param {AppetizerUpdateInterface} appetizer - Contains 
     * @returns - The object that was updated in the database
     */
    async updateAppetizerById(appetizer: AppetizerUpdateInterface){
        const existingAppetizer = await this.getAppetizerByID(appetizer.appetizerID);
        if(existingAppetizer === null){
            throw new Error("An appetizer with that PK does not exist. Cannot update row");
        }
        
        //Override the existing appetizer with the new data
        const updateAppetizer = {...existingAppetizer, ...appetizer};
        if(updateAppetizer.price < 0){
            throw new Error("Price cannot be negative");
        }

        return await this.repository.save(updateAppetizer);
    };

    /**
     * Deletes an appetizer with the given PK from the table
     * @param {number | undefined} appetizerID - The primary key of the appetizer we want to delete
     * @returns - An empty promise
     */
    async deleteAppetizerById(appetizerID: number|undefined){
        const appetizer = await this.getAppetizerByID(appetizerID);
        if(appetizer === null){
            throw new Error("An appetizer with that PK does not exist");
        }
        return await this.repository.remove(appetizer);
    };

    /**
     * Clears all the data in the given table via hte TRUNCATE method
     * @returns - An empty promise
     */
    async deleteAllAppetizers(){
        return await this.repository.clear();
    }

}