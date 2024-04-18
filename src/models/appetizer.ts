/**
 * Cesar Guerrero
 * 04/16/24
 * 
 * @file TypeORM Model for the Appetizer Table and InputType Mutations
 */


import { ObjectType, Field, InputType, Int, Float} from 'type-graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


//This is the model for the Appetizer Table and the Type for GraphQL
@ObjectType()
@Entity()
export class Appetizer{
    @Field(type => Int)
    @PrimaryGeneratedColumn()
    appetizerID?: number

    @Field()
    @Column()
    name!: string

    @Field({nullable: true})
    @Column({default: "Yummy Appetizer"})
    description?: string

    @Field()
    @Column({type: "float"})
    price!: number
}

//Create InputType for GraphQL Mutations - I want to keep the input type and model in the same file
@InputType("Word")
export class CreateAppetizerInput{
    @Field()
    name!: string

    @Field({nullable: true})
    description?: string

    @Field(type => Float)
    price!: number
}

//Update InputType for GraphQL Mutations - I want to keep the input type and model in the same file
@InputType()
export class UpdateAppetizerInput{
    @Field(type => Int)
    appetizerID!: number

    @Field({nullable: true})
    name?: string

    @Field({nullable: true})
    description?: string

    @Field({nullable: true})
    price?: number
}