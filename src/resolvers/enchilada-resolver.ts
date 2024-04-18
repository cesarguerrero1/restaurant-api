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
        const enchilada = ctx.dataSource.getRepository(Enchilada).create(data);
        return await ctx.dataSource.getRepository(Enchilada).save(enchilada);
    };
};