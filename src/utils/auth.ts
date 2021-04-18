import {User} from '../entities/user';
import {sign} from 'jsonwebtoken';
import  enviroment from "../config/enviroments.config";

export const createAccessToken = (user:User) => {
    return sign({ userId : user.id }, enviroment.accessTokenSecret, {
        expiresIn: "1h"
    });
};

export const createRefreshToken = (user:User) => {
    return sign({ userId: user.id, tokenVersion : user.tokenVersion }, enviroment.refreshTokenSecret, {expiresIn: "7d" }); 
};