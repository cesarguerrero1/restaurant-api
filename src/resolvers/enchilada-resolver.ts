/**
 * Cesar Guerrero
 * 04/18/24
 * 
 * @file The query and mutation resolver for the enchilada table
 * NOTE: This file is incomplete and is only meant to be a starting point
 */

import { DataSource } from "typeorm";
import { Resolver, Query, Mutation, Arg, Ctx} from "type-graphql";
import { Enchilada, CreateEnchiladaInput} from "../models/enchilada";
import { EnchiladaPrice } from "../models/enchilada-price";

@Resolver(Enchilada)
export default class EnchiladaResolver{

    @Query(() => [Enchilada])
    async enchiladas(@Ctx() ctx: {dataSource: DataSource}){
        return await ctx.dataSource.getRepository(Enchilada).find();
    }

    @Mutation(() => Enchilada)
    async createEnchilada(
        @Arg("data") data: CreateEnchiladaInput,
        @Ctx() ctx: {dataSource: DataSource}
    ){  
        //In order to keep these linked we need to pass the EnchiladaPrice Object as our model suggests
        const enchiladaPrice = await ctx.dataSource.getRepository(EnchiladaPrice).findOne({
            where:{
                enchiladaPriceID: data.enchiladaPriceID
            }
        });

        if(!enchiladaPrice){
            throw new Error("Enchilada Price PK not found");
        }

        //Create the enchilada object
        const enchilada = ctx.dataSource.getRepository(Enchilada).create({
            ...data,
            enchiladaPrice
        });
        
        return await ctx.dataSource.getRepository(Enchilada).save(enchilada);
    };
};