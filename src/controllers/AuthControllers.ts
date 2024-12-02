import { Response,Request } from "express";

export class AuthControllers {
    register(res:Response,req:Request) {
        res.status(201);
        res.send();
    }
}