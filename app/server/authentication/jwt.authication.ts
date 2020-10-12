import { AuthenticationSpec } from "../contracts/authenticationspec.interface";
import express from "express";
import { inject, injectable } from "tsyringe";
import { TokenAuthSpec } from "../contracts/tokenauthspec.interface";
import { UserRepositorySpec } from "../../data/repositories/repository.interface";

@injectable()
export class JWTAuthentication implements AuthenticationSpec<express.RequestHandler>{

    constructor(@inject("TokenAuthSpec") private tokenAuthentication?: TokenAuthSpec, @inject("UserRepositorySpec") private userRepository?: UserRepositorySpec){}

    provideAuthentication(exemptedRoutes:Array<string>): express.RequestHandler{
        console.log("ROUTES:");
        console.log(exemptedRoutes);
        let exempted = false;
        const requestHandler: express.RequestHandler = (req, res, next)=>{
            try{

                for(let route of exemptedRoutes){
                    console.log(req.baseUrl);
                    if(req.baseUrl.startsWith(route)){
                        console.log(`ROUTE: ${route}`);
                        exempted = true;
                        break;
                    }
                }

                if(exempted){
                    console.log("NEXT");
                    next();
                    return;
                }

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