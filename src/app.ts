import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import  enviroment from "./config/enviroments.config";
import { buildSchema } from "type-graphql"
import cookieParser from "cookie-parser";
import { PingResolver } from './resolvers/ping';
import { UserResolver } from './resolvers/user.resolver';
import { isAuthorizated } from "./middleware/is-authorizated";
import { User } from './entities/user';
import { verify } from 'jsonwebtoken';
import { createAccessToken,createRefreshToken } from './utils/auth';
import { sendRefreshToken } from './utils/sendRefreshToken';

export async function startServer() {
    const app = express();
    app.use(cookieParser());
    
    app.post("/refresh_token",async (req,res) => {
        const token = req.cookies.jrt;
        if(!token){
            return res.send({ok: false, accessToken : ''});
        }

        let payload : any = null;
        try {
            payload = verify(token, enviroment.refreshTokenSecret!);
        } catch (error) {
            console.log(error);
            return res.send({ok: false, accessToken : ''});
        }

        const userAux = payload as User;
        const user = await User.findOne({id : userAux.id});

        if(!user){
            return res.send({ok: false, accessToken : ''});
        }else if(user.tokenVersion !== userAux.tokenVersion){
            return res.send({ok: false, accessToken : ''});
        }else if(user.status !== "A"){
            return res.send({ok: false, accessToken : ''});
        }

        sendRefreshToken(res,createRefreshToken(user));

        return res.send({ok: true, accessToken : createAccessToken});

    });
    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [ PingResolver,UserResolver],
            authChecker: isAuthorizated
        }),
        context: ({ req, res }) => ({ req, res }), // Recibe , Devuelve

    });
    server.applyMiddleware({ app, path: '/graphql' });
    return app;
}


