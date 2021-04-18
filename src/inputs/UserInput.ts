import { ObjectType,  InputType ,Field } from "type-graphql";
import { UserTypes } from "../entities/user"

@ObjectType()
export class LoginResponse {
    @Field()
    accessToken?: string;
}

@InputType({ description: "Add new user" })
export class UserRegisterInput {
    
    @Field({ nullable: false })
    user!: string

    @Field({ nullable: false })
    pass!: string

    @Field({ nullable: false })
    mail!: string

    @Field({ nullable: false })
    name!: string

    @Field({ nullable: true })
    surname!: string

    @Field({ nullable: true })
    phone!: string

}

@InputType({ description: "Editable user information" })
export class UserUpdateInput {
    
    @Field({ nullable: true })
    user?: string

    @Field({ nullable: true })
    pass?: string

    @Field({ nullable: true })
    mail?: string

    @Field({ nullable: true })
    name?: string

    @Field({ nullable: true })
    surname?: string

    @Field({ nullable: true })
    phone?: string

    @Field(type => UserTypes)
    role?: UserTypes;
}

@InputType({ description: "Editable user password" })
export class UserPassInput {
    @Field()
    password!: string;
}