/**
 * Cesar Guerrero
 * 04/16/24
 * 
 * @file TypeORM Model for the Salad Table
 */


import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Salad{
    @PrimaryGeneratedColumn()
    saladID!: number

    @Column()
    name!: string

    @Column({default: "Yummy Salad"})
    description!: string

    @Column("real")
    price!: number
}