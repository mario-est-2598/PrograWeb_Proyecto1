import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { AppContext } from "../interfaces/AppContext"; 
import  enviroment   from "../config/enviroments.config";
import { User } from "../entities/user";

export const isAuthenticated: MiddlewareFn<AppContext> = ({ context }, next) => {

  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("Not authenticated");
  }
 
  try { 
    const token = authorization.split(" ")[1];
    const payload = verify(token, enviroment.accessTokenSecret);
    context.user = payload as User;
  } catch (err) {
    console.log(err);
    throw new Error("Not authenticated");
  }
  return next();
};