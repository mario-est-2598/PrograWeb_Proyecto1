import {Response} from 'express';

export const sendRefreshToken = (res : Response, token : string) => {
    res.cookie('jrt',token,
    {
        httpOnly : true,
    }); //Json Refresh token
}