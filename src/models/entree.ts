/**
 * Cesar Guerrero
 * 04/16/24
 * 
 * @file TypeORM Model for the Entree Table
 */


import { ObjectType, Field, InputType, Int, Float} from 'type-graphql';
import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

//This is the model for the Entree Table and the Type for GraphQL
@ObjectType()
@Entity()
export class Entree{
    @Field(type => Int)
    @PrimaryGeneratedColumn()
    entreeID?: number

    @Field()
    @Column()
    name!: string

    @Field({nullable: true})
    @Column({default: "Yummy Entree"})
    description?: string

    @Field()
    @Column({type: "float"})
    price!: number
}

@InputType()
export class CreateEntreeInput{
    @Field()
    name!: string

    @Field({nullable: true})
    description?: string

    @Field(type => Float)
    price!: number
}

@InputType()
export class UpdateEntreeInput{
    @Field(type => Int)
    entreeID!: number

    @Field({nullable: true})
    name?: string

    @Field({nullable: true})
    description?: string

    @Field({nullable: true})
    price?: number
}