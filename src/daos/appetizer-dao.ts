/**
 * Cesar Guerrero
 * 04/17/2024
 * 
 * @file DAO for the Appetizer Table
 */

import { Repository, DataSource} from "typeorm";
import { Appetizer } from "../models/appetizer";

export default class AppetizerDAO{

    //We are going to be using a repository to interact with the database
    private repository : Repository<Appetizer>;

    constructor(dataSource: DataSource){
        this.repository = dataSource.getRepository(Appetizer);
    }

}