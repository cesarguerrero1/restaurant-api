/**
 * Cesar Guerrero
 * 04/18/24
 * 
 * @file The query and mutation resolver for the enchilada-price table
 * NOTE: This file is incomplete and is only meant to be a starting point
 */

import { DataSource } from "typeorm";
import { Resolver, Query, Mutation, Arg, Ctx} from "type-graphql";
import { EnchiladaPrice, CreateEnchiladaPriceInput} from "../models/enchilada-price";

@Resolver(EnchiladaPrice)
export default class EnchiladaPriceResolver{
    
    @Query(() => [EnchiladaPrice])
    async enchiladaPrices(@Ctx() ctx: {dataSource: DataSource}){
        return await ctx.dataSource.getRepository(EnchiladaPrice).find();
    }

    @Mutation(() => EnchiladaPrice)
    async createEnchiladaPrice(
        @Arg("data") data: CreateEnchiladaPriceInput,
        @Ctx() ctx: {dataSource: DataSource}
    ){
        const enchiladaPrice = ctx.dataSource.getRepository(EnchiladaPrice).create(data);
        return await ctx.dataSource.getRepository(EnchiladaPrice).save(enchiladaPrice);
    };
}
