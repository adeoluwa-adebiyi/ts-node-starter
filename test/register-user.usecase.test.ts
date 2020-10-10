import "../app/appregistry.registry"
import { container } from "tsyringe";
import { PasswordHasherSpec } from "../app/common/core/hashers/contract/hasher.interface";
import { DatabaseSpec } from "../app/data/datasources/datasource.interface";
import { UserRepositorySpec } from "../app/data/repositories/repository.interface";
import { expect } from "chai";
import { RegisterUserUsecase, RegisterUserUsecaseParams, UserRegistrationResponse } from "../app/domain/usecases/register-user.usecase";
import { UserModel } from "../app/domain/entities/user.model";
import { USER_REGISTRATION_CREDENTIALS } from "./test.data";
import { database } from "faker";
import { afterTestRoutine, beforeTestRoutine } from "./test-routines";
import { InvalidArgumentsException } from "../app/domain/usecases/exceptions/invalid-arguments.exception";


const passwordHasher: PasswordHasherSpec = container.resolve("PasswordHasherSpec");

const userRepository: UserRepositorySpec = container.resolve("UserRepositorySpec");

const USER_TABLE: string = "bb";


describe("Tests RegisterUserUsecase", ()=>{

    const userPassword: string = "jellyjones44$$";

    const userCredentials = USER_REGISTRATION_CREDENTIALS;

    const { password } = userCredentials;

    const validPasswordHash = passwordHasher.hashPassword(password);

    const validUser:UserModel =  new UserModel().fromJSON(userCredentials);

    const database: DatabaseSpec = container.resolve("DatabaseSpec");


    before(()=>{
        database.connect();
    });

    it("Should throw InvalidArgumentsException on form validation failure", async()=>{
        try{
            const userRegResponse = await new RegisterUserUsecase().execute(<RegisterUserUsecaseParams>{});
        }catch(e){
            expect(e).to.be.instanceOf(InvalidArgumentsException);
        }
    });

    it("Should register a new user with a valid UserModel persisted", async()=>{
        database.getConnector().query(`DELETE FROM ${USER_TABLE} WHERE email = $1`,[userCredentials.email]).then(async()=>{
            const userRegResponse: UserRegistrationResponse = await new RegisterUserUsecase().execute({...userCredentials});
            expect(JSON.stringify(userRegResponse.user.toJSON())).to.equal(JSON.stringify({...validUser.toJSON(), id: userRegResponse.user.id, passwordHash: userRegResponse.user.passwordHash}));
        });
    });

    it("Should register a new user with a valid password hash", async()=>{
        database.getConnector().query(`DELETE FROM ${USER_TABLE} WHERE email = $1`,[userCredentials.email]).then(async()=>{
            const userRegResponse: UserRegistrationResponse = await new RegisterUserUsecase().execute({...userCredentials});
            expect(userRegResponse.user.toJSONWithAuthCred().passwordHash).to.equal(validPasswordHash);
        });
    });

    // it("Should return a valid UserRegistrationResponse object", async()=>{

    // });

    after(()=>{
        // afterTestRoutine();
    })

});