import { UserAuthId } from "../app/domain/entities/user.model";
// import "reflect-metadata";
import "../app/appregistry.registry"
import { AuthenticateUserUsecase, UserLoginCredentials } from "../app/domain/usecases/authenticate-users.usecase";
import { JWTAuthentication } from "../app/server/authentication/jwt.authication";
import { JWTTokenAuthAlgorithm } from "../app/server/core/jwt-token.token-auth";
import { PasswordHasherSpec } from "../app/common/core/hashers/contract/hasher.interface";
import { container } from "tsyringe";
import { expect } from "chai";
import { UserRepositorySpec } from "../app/data/repositories/repository.interface";
import { DatabaseSpec } from "../app/data/datasources/datasource.interface";
import { RegisterUserUsecase, UserRegistrationResponse } from "../app/domain/usecases/register-user.usecase";

const userLoginCredentials:UserLoginCredentials = {
    username:"wilkinson@mail.com",
    password: "testuser123"
} 

const passwordHasher: PasswordHasherSpec = container.resolve("PasswordHasherSpec");
const userRepository: UserRepositorySpec = container.resolve("UserRepositorySpec");
const database: DatabaseSpec = container.resolve("DatabaseSpec");

describe("Tests AuthenticateUser usecase functionality", ()=>{

    before(async ()=>{
        await database.connect();
    })

    const { username, password } = userLoginCredentials;

    it("Should return valid AuthTokenModels for valid login credentials", async()=>{
       userRepository.deleteUser({email: userLoginCredentials.username}).then(()=>{
        new RegisterUserUsecase().execute({...userLoginCredentials, email: userLoginCredentials.username}).then(async (userRegResponse: UserRegistrationResponse)=>{
            const authToken = await new AuthenticateUserUsecase().execute({...userLoginCredentials});
            new JWTTokenAuthAlgorithm().verify( authToken.accessToken, (err:any, validatedToken:string)=>{
                expect(err).to.equal(null);
                expect(validatedToken).to.be("string");
               });
           })
       })
    }); 

})