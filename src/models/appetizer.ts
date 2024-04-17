/**
 * Cesar Guerrero
 * 04/16/24
 * 
 * @file TypeORM Model for the Appetizer Table
 */


import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Appetizer{
    @PrimaryGeneratedColumn()
    appetizerID?: number

    @Column()
    name!: string

    @Column({default: "Yummy Appetizer"})
    description!: string

    @Column("real")
    price!: number
}