import { request, Request,Response } from 'express';
import { User } from "../entities/user";

export interface AppContext{
    req : Request;
    res : Response;
    user?: User;
}