// import { expect } from "chai";
// import { exit } from "process";
// import "reflect-metadata";
// import { container } from "tsyringe";
// import "../app/appregistry.registry";
// import { InvalidLoginCredentialsException } from "../app/common/exceptions/invalid-login-credentials.exception";
// import { DatabaseSpec } from "../app/data/datasources/datasource.interface";
// import { UserRepositorySpec } from "../app/data/repositories/repository.interface";
// import { AuthControllerSpec } from "../app/domain/controllers/auth-controller.interface";
// import { RegisterUserUsecase, UserRegistrationResponse } from "../app/domain/usecases/register-user.usecase";
// import { TokenAuthSpec } from "../app/server/contracts/tokenauthspec.interface";
// import { emptyDB, seedDB } from "../seed_db";
// import { userLoginCredentials, USER_REGISTRATION_CREDENTIALS } from "./test.data";


// const authController:AuthControllerSpec = container.resolve("AuthControllerSpec"); 

// const loginCredentials = userLoginCredentials;

// const database: DatabaseSpec = container.resolve("DatabaseSpec");

// const tokenAuth: TokenAuthSpec = container.resolve("TokenAuthSpec");

// const userRepository: UserRepositorySpec = container.resolve("UserRepositorySpec");

// const invalidPassword = "kmdslklkshfkjjhshjv";


// describe("Tests AuthController AuthenticateUser feature for functionality", ()=>{

//     before(()=>{
//         emptyDB(database).then(async()=>{
//             await seedDB(database);
//         })
//     })

//     it("Should authenticate validate user login credentials information correctly",async()=>{
//         return new Promise(async(resolve)=>{
//         const {username, password} = loginCredentials;
//         userRepository.deleteUser({email: loginCredentials.username}).then(()=>{
//             new RegisterUserUsecase().execute({...userLoginCredentials, email: userLoginCredentials.username}).then(async (userRegResponse: UserRegistrationResponse)=>{
//                 const user = userRegResponse.user;
//                 const authToken = await authController.generateUserAuthToken(username, password);

//                 tokenAuth.verify(authToken.accessToken, (err: any, validatedToken:string)=>{
//                     expect(err).to.equal(null);
//                     expect(validatedToken).to.be.instanceOf(Object);
//                     resolve();
//                 });

//             });
//         });
//     });
        
//     });

//     it("Should authenticate invalid user login credentials information correctly",async()=>{
//         return new Promise(async(resolve)=>{

//             const {username, password} = loginCredentials;

//             userRepository.deleteUser({email: loginCredentials.username}).then(()=>{
//                 new RegisterUserUsecase().execute({...userLoginCredentials, email: userLoginCredentials.username}).then(async (userRegResponse: UserRegistrationResponse)=>{
//                     const user = userRegResponse.user;
//                     try{
//                         const authToken = await authController.generateUserAuthToken(username, invalidPassword);
//                     }catch(e){
//                         expect(e).to.be.instanceOf(InvalidLoginCredentialsException);
//                         resolve();
//                     }
//                 });
//             });

//         });
        
//     });

//     after(()=>{
//         // exit(0);
//     })

// });