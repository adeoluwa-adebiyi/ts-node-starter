import { Router } from "express";
import { autoInjectable, inject, injectable } from "tsyringe";
import { AuthTokenModel } from "../../entities/auth-tokens.model";
import { UserJSON } from "../../entities/user.model";
import { AuthenticateUserUsecase } from "../../usecases/authenticate-users.usecase";
import { AuthControllerSpec } from "../auth-controller.interface";


@injectable()
export class AuthController implements AuthControllerSpec{


    constructor(private authenticateUserUsecase:AuthenticateUserUsecase){}
    
    registerUser(userCredentials: any): Promise<UserJSON> {
        throw new Error("Method not implemented.");
    }

    async generateUserAuthToken(username: string, password: string) : Promise<AuthTokenModel> {
        return await this.authenticateUserUsecase.execute({username, password});
    }

    refreshUserToken(refreshToken: string): Promise<AuthTokenModel> {
        throw new Error("Method not implemented.");
    }

    generateRoutes(): Router {
        throw new Error("Method not implemented.");
    }

}