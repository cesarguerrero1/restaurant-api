/**
 * Cesar Guerrero
 * 04/17/24
 * 
 * @file The query and mutation resolver for the appetizer table
 */


import { Resolver, Query, Mutation, Arg, Ctx, Int} from "type-graphql";
import AppetizerDAO from "../daos/appetizer-dao";
import { Appetizer, CreateAppetizerInput, UpdateAppetizerInput} from "../models/appetizer";

/**
 * The query and mutation resolver for the appetizer table
 */
@Resolver(Appetizer)
export default class AppetizerResolver{

    /**
     * A query to get all of the rows in the appetizer table
     * @param {Ctx} ctx - The context object that contains the appetizerDAO
     * @returns - A promise that resolves to an array of all the appetizers in the table
     */
    @Query(() => [Appetizer])
    async appetizers( @Ctx() ctx: {appetizerDAO: AppetizerDAO}){
        return await ctx.appetizerDAO.getAllAppetizers();
    }

    /**
     * A query to get a single appetizer by its primary key
     * @param {Ctx} ctx - The context object that contains the appetizerDAO
     * @param {Integer} appetizerID - The primary key of the appetizer we want to retrieve
     * @returns - A promise that resolves to the appetizer object with the given ID or NULL
     */
    @Query(() => Appetizer, {nullable: true})
    async appetizer(@Ctx() ctx: {appetizerDAO: AppetizerDAO}, @Arg("appetizerID", type => Int) appetizerID: number){
        return await ctx.appetizerDAO.getAppetizerByID(appetizerID);
    }

    /**
     * A mutation to create a new appetizer
     * @param {Ctx} ctx - The context object that contains the appetizerDAO
     * @param {CreateAppetizerInput} data - The data needed to create a new appetizer
     * @returns - The object that was created in the database
     */
    @Mutation(() => Appetizer)
    async createAppetizer(
        @Arg("data") data: CreateAppetizerInput,
        @Ctx() ctx: {appetizerDAO: AppetizerDAO}
    ){
        //We are not using a try catch block here because we want the error from the DAO to propagate up
        return await ctx.appetizerDAO.createAppetizer(data);
    };

    /**
     * A mutation to update an appetizer
     * @param {Ctx} ctx - The context object that contains the appetizerDAO
     * @param {UpdateAppetizerInput} data - The data needed to update a new appetizer
     * @returns - The object that was updated in the database
     */
    @Mutation(() => Appetizer)
    async updateAppetizer(@Ctx() ctx: {appetizerDAO: AppetizerDAO}, @Arg("data") data: UpdateAppetizerInput){
        //We are not using a try catch block here because we want the error from the DAO to propagate up
        return await ctx.appetizerDAO.updateAppetizerById(data);
    };

    /**
     * A mutation to delete an appetizer by its primary key
     * @param {Ctx} ctx - The context object that contains the appetizerDAO
     * @param {AppetizerDAO} appetizerID - The primary key of the appetizer we want to retrieve
     * @returns - A promise that resolves to a boolean
     */
    @Mutation(() => Boolean)
    async deleteAppetizer(@Ctx() ctx: {appetizerDAO: AppetizerDAO}, @Arg("appetizerID", type => Int) appetizerID: number){
        
        try{
            await ctx.appetizerDAO.deleteAppetizerById(appetizerID);
            return true;
        }catch(error){
            return false;
        }
    };
};