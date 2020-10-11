import { autoInjectable, inject, singleton } from "tsyringe";
import { AuthTokenModel } from "../entities/auth-tokens.model";
import { UseCaseSpec } from "./contracts/usecasespec.interface";
import "reflect-metadata";
import { UserRepositorySpec } from "../../data/repositories/repository.interface";
import { JWTTokenAuthAlgorithm } from "../../server/core/jwt-token.token-auth";
import { InvalidLoginCredentialsException } from "../../common/exceptions/invalid-login-credentials.exception";


export interface UserLoginCredentials{
    username: string;
    password: string;
}

export interface UserAuthClaim{
    expiresAt: number;
    id: number;
}


export const accessTokenExpiryDuration = ()=> Date.now()+ (60 * 60 * 24 * 7);

export const refreshTokenExpiryDuration = ()=> Date.now()+ (60 * 60 * 24 * 60);


@autoInjectable()
export class AuthenticateUserUsecase implements UseCaseSpec<Promise<AuthTokenModel>> {

    constructor(@inject("UserRepositorySpec") private userRepository?: UserRepositorySpec, @inject("TokenAuthSpec") private tokenAuthALgporithm?: JWTTokenAuthAlgorithm){}

    async execute(params: UserLoginCredentials): Promise<AuthTokenModel> {
        const { username } = params;
        const email = username;
        const user = await this.userRepository.getUserById({ email });
        if(user){
            const accessTokenClaims:UserAuthClaim = {
                expiresAt: accessTokenExpiryDuration(),
                id: user.id
            }
            return new AuthTokenModel(
                this.tokenAuthALgporithm.generateToken(accessTokenClaims),
                this.tokenAuthALgporithm.generateToken({...accessTokenClaims, expiresAt: refreshTokenExpiryDuration()})
            );
        }else{
            throw new InvalidLoginCredentialsException("Invalid login credentials");
        }
    }
}