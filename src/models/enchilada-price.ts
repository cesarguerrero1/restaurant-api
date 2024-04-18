/**
 * Cesar Guerrero
 * 04/18/24
 * 
 * @file TypeORM Model for the EnchiladaPrice Table
 */

import { ObjectType, Field, InputType, Int, Float} from 'type-graphql';
import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@ObjectType()
@Entity()
export class EnchiladaPrice{
    @Field(type => Int)
    @PrimaryGeneratedColumn()
    enchiladaPriceID?: number

    @Field()
    @Column({type: "float"})
    priceForOne!: number

    @Field()
    @Column({type: "float"})
    priceForTwo!: number

    @Field()
    @Column({type: "float"})
    priceForThree!: number

}

@InputType()
export class createEnchiladaPriceInput{
    @Field(type => Float)
    priceForOne!: number

    @Field(type => Float)
    priceForTwo!: number

    @Field(type => Float)
    priceForThree!: number
}

//We are foregoing update for the sake of speed