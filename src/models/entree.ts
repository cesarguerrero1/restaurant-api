/**
 * Cesar Guerrero
 * 04/16/24
 * 
 * @file TypeORM Model for the Entree Table
 */


import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Entree{
    @PrimaryGeneratedColumn()
    entreeID?: number

    @Column()
    name!: string

    @Column({default: "Yummy Entree"})
    description!: string

    @Column("real")
    price!: number
}