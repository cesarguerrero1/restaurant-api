/**
 * Cesar Guerrero
 * 04/16/24
 * 
 * @file TypeORM Model for the Appetizer Table
 */


import { ObjectType, Field} from 'type-graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Appetizer{
    @Field()
    @PrimaryGeneratedColumn()
    appetizerID?: number

    @Field()
    @Column()
    name!: string

    @Field({nullable: true})
    @Column({default: "Yummy Appetizer"})
    description?: string

    @Field()
    @Column({type: "real"})
    price!: number
}