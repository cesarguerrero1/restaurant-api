/**
 * Cesar Guerrero
 * 04/18/24
 * 
 * @file TypeORM Model for the Enchilada Table
 */


import { ObjectType, Field, InputType, Int, Float} from 'type-graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import { EnchiladaPrice } from './enchilada-price';

@ObjectType()
@Entity()
export class Enchilada{
    @Field(type => Int)
    @PrimaryGeneratedColumn()
    enchiladaID?: number

    @Field()
    @Column()
    name!: string

    @Field(type => EnchiladaPrice)
    @ManyToOne(() => EnchiladaPrice, {
        onDelete: "RESTRICT",
        nullable: false,
        eager: true //We want to always load the price when we load the enchilada
    })
    enchiladaPrice!: EnchiladaPrice
}

@InputType()
export class CreateEnchiladaInput{
    @Field()
    name!: string

    @Field(type => Int)
    enchiladaPriceID!: number
}

//We are foregoing update for the sake of speed