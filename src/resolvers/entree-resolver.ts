/**
 * Cesar Guerrero
 * 04/18/24
 * 
 * @file The query and mutation resolver for the entree table
 */

import { Resolver, Query, Mutation, Arg, Ctx, Int} from "type-graphql";
import EntreeDAO from "../daos/entree-dao";
import { Entree, CreateEntreeInput, UpdateEntreeInput} from "../models/entree";

/**
 * The query and mutation resolver for the entree table
 */
@Resolver(Entree)
export default class EntreeResolver{

    /**
     * A query to get all of the rows in the entree table
     * @param {Ctx} ctx - The context object that contains the entreeDAO
     * @returns - A promise that resolves to an array of all the entrees in the table
     */
    @Query(() => [Entree])
    async entrees( @Ctx() ctx: {entreeDAO: EntreeDAO}){
        return await ctx.entreeDAO.getAllEntrees();
    }

    /**
     * A query to get a single entree by its primary key
     * @param {Ctx} ctx - The context object that contains the entreeDAO
     * @param {Integer} entreeID - The primary key of the entree we want to retrieve
     * @returns - A promise that resolves to the entree object with the given ID or NULL
     */
    @Query(() => Entree, {nullable: true})
    async entree(@Ctx() ctx: {entreeDAO: EntreeDAO}, @Arg("entreeID", type => Int) entreeID: number){
        return await ctx.entreeDAO.getEntreeByID(entreeID);
    }

    /**
     * A mutation to create a new entree
     * @param {Ctx} ctx - The context object that contains the entreeDAO
     * @param {CreateEntreeInput} data - The data needed to create a new entree
     * @returns - The object that was created in the database
     */
    @Mutation(() => Entree)
    async createEntree(
        @Arg("data") data: CreateEntreeInput,
        @Ctx() ctx: {entreeDAO: EntreeDAO}
    ){
        //We are not using a try catch block here because we want the error from the DAO to propagate up
        return await ctx.entreeDAO.createEntree(data);
    };

    

}