import { Controller } from "../../common/core/contracts/controller.interface";
import { AuthTokenModel } from "../entities/auth-tokens.model";
import { UserJSON } from "../entities/user.model";


export interface AuthControllerSpec extends Controller<any>{
    registerUser(userCredentials:any):Promise<UserJSON>;
    generateUserAuthToken(username:string, password: string): Promise<AuthTokenModel>;
    refreshUserToken(refreshToken:string): Promise<AuthTokenModel>;
    generateRoutes():any;
}