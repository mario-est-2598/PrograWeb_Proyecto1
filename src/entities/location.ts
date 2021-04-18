import {Entity, Column, PrimaryGeneratedColumn,BaseEntity, CreateDateColumn} from 'typeorm';
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Location extends BaseEntity{
    
    @Field()
    @PrimaryGeneratedColumn()
    id!:number;
   
    @Field()
    @Column({ type: "varchar", length: 50 })
    longitude!:string;

    @Field()
    @Column({ type: "varchar", length: 50 })
    latitude!:string;

    @Field(()=>Int)
    @Column({ type: "varchar", length: 300 })
    other_sings!:string;
    

}