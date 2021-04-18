import { Entity, PrimaryGeneratedColumn,CreateDateColumn, Column, BaseEntity,JoinColumn, OneToOne } from "typeorm";
import { ObjectType, Field, ID, Authorized, registerEnumType } from "type-graphql";
import { Location } from './location';

export enum UserTypes {
    ADMIN = "ADMIN",
    BASIC = "BASIC",
    OFFERER = "OFFERER",
    GUESS = "GUESS"
}

registerEnumType(UserTypes, {
name: "UserTypes",
    description: "Roles types of the application",
    valuesConfig: {
        GUESS: {
            description: "Unauthentic user role",
        },
        BASIC: {
            description: "Authentic user role",
        },
        OFFERER: {
            description: "Offerer user role",
        },
        ADMIN: {
            description: "Admin user role",
        },
    },
});

@ObjectType()
@Entity()
export class User extends BaseEntity {
    
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({ type: "varchar", length: 40 })
    user!: string;

    @Field(() => String)
    @Column({ type: "varchar", length: 250 })
    pass!: string;

    @Field(() => String)
    @Column({ type: "varchar", length: 40 })
    name!: string;

    @Field(() => String)
    @Column({ type: "varchar", length: 80 })
    surname!: string;

    @Field(() => String)
    @Column({ type: "varchar", length: 80 })
    mail!: string;

    @Field(() => String)
    @CreateDateColumn({type: 'timestamp'})
    createdAt!: string;

    @Field(() => String)
    @Column({ type: "varchar", length: 15 })
    phone!: string;

    @Field(() => String)
    @Column({ type: "varchar", length: 300 })
    urlPhoto!: string;

    @Field(() => String)
    @Column({ type: "varchar", length: 1,default:"A" })
    status!: string;

    @Field(type => UserTypes)
    @Column()
    role!: UserTypes;

    @OneToOne(() => Location)
    @JoinColumn()
    location!: Location;

    @Column("int", { default: 0 })
    tokenVersion!: number;
}