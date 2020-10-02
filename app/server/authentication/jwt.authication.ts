import { AuthenticationSpec } from "../contracts/authenticationspec.interface";

import express from "express";
import { inject, injectable } from "tsyringe";
import { TokenAuthSpec } from "../contracts/tokenauthspec.interface";

@injectable()
export class JWTAuthentication implements AuthenticationSpec<express.RequestHandler>{

    constructor(@inject("TokenAuthSpec") private tokenAuthentication: TokenAuthSpec){}

    provideAuthentication(): express.RequestHandler{
        const requestHandler: express.RequestHandler = (req, res, next)=>{
            try{
                if(!req.headers.authorization)
                    throw {message: "Authorization header is required"};

                this.tokenAuthentication.verify(req.headers.authorization?.replace("Bearer ", ""), (err:any, verifiedJwt: any)=>{
                    if(err){
                        res.status(401).send({message: "Authentication failed"})
                    }else{
                        next();
                    }
                });
            }catch(e){
                res.status(401).send(e);
            }
        }
        return requestHandler;
    }
}