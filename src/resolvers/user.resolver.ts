import {
    Resolver,
    Query,
    Mutation,
    Arg,
    UseMiddleware,
    Ctx,
    Int
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { User } from "../entities/user";
import { UserRegisterInput, UserUpdateInput, LoginResponse } from "../inputs/UserInput";
import { isAuthenticated } from "../middleware/is-authenticated";
import { AppContext } from "../interfaces/AppContext";
import { UserTypes } from "../entities/user";
import { createAccessToken,createRefreshToken } from "../utils/auth";
import { sendRefreshToken } from "../utils/sendRefreshToken";
import { getConnection } from "typeorm";

@Resolver()
export class UserResolver {

    @Query(() => [User])
    @UseMiddleware(isAuthenticated)
    async users(
        @Ctx() { user }: AppContext ){
            console.log(user);
            return User.find();
    }

    @Mutation(() => User)
    async userRegister(
        @Arg("user", () => UserRegisterInput) user: UserRegisterInput
    ) {
        const hashedPassword = await hash(user.pass, 13);
        const newUser = User.create(user);
        newUser.role = UserTypes.BASIC;
        newUser.status = "A";
        console.log(newUser);
        return await newUser.save();
    }

    @Mutation(() => Boolean)
    async userUpdate(
        @Arg("id", () => Int) id: number,
        @Arg("user", () => UserUpdateInput) user: UserUpdateInput) {

        await User.update({ id }, user);
        return true;
    }
// IMPORTANTE TODO QUITAR https://www.youtube.com/watch?v=25GS0MLT8JU
    @Mutation(() => Boolean)
    async userDelete(
        @Arg("id", () => Int) id: number) {
        User.delete(id);
        return true;
    }

    @Query(() => [User])
    getUsers() {
        return User.find()
    }

    @Mutation(() => Boolean)
    async revokeRefreshTokensUser(
        @Arg("id", () => Int) id: number) {
        await getConnection().getRepository(User).increment({id:id},'tokenVersion',1);

        return true;
    }

    @Mutation(() => LoginResponse)
    async logIn(
        @Arg("user") user: string,
        @Arg("pass") pass: string,
        @Ctx() { res }: AppContext
    ): Promise<LoginResponse> {
        try {
            const userLogin = await User.findOne({ where: { user } })
            if (!userLogin) {
                throw new Error("Could not find a user")
            }
            console.log(userLogin.pass)

            const verify = await compare(pass, userLogin.pass)

            if (!verify) {
                throw new Error("Wrong password")
            }

            sendRefreshToken(res,createRefreshToken(userLogin));

            return {
                accessToken: createAccessToken(userLogin)
            }

        } catch (err) {
            console.log(err)
            throw new Error(err)
        }
    }

}