import Axios from "axios";
import bodyParser from "body-parser";
import { expect } from "chai";
import { container } from "tsyringe";
import { HOST } from "../../../app/config/app.config";
import { DatabaseSpec } from "../../../app/data/datasources/datasource.interface";
import { UserRepositorySpec } from "../../../app/data/repositories/repository.interface";
import { RegisterUserUsecaseParams } from "../../../app/domain/usecases/register-user.usecase";
import { IndexRouter } from "../../../app/routes/express/index.route";
import { INDEX_ENDPOINT, REGISTER_USER_ENDPOINT } from "../../../app/routes/urls";
import { MiddlewareConfigurable, RoutableWebServerSpec } from "../../../app/server/contracts/webserverspec.interface";
import { JWTTokenAuthAlgorithm } from "../../../app/server/core/jwt-token.token-auth";
import { ExpressWebServer } from "../../../app/server/express.webserver";
import { USER_REGISTRATION_CREDENTIALS } from "../../test.data";


const userCredentials = USER_REGISTRATION_CREDENTIALS;

const AUTH_USER_ROUTE = "/auth";

const webServer: RoutableWebServerSpec = new ExpressWebServer( container.resolve("AuthenticationSpec<<express.RequestHandler>>"), ["/register"] );

(<MiddlewareConfigurable>webServer).addMiddleware(bodyParser.json());

const userRepository: UserRepositorySpec = container.resolve("UserRepositorySpec");

const database: DatabaseSpec = container.resolve("DatabaseSpec");

const USER_TABLE = "bb";

const userLoginCredentials = {
    username: userCredentials.email,
    password: userCredentials.password
}

describe("Tests User registration endpoint",()=>{


    before(()=>{
        webServer.listen(80, "127.0.0.1");
        webServer.addRoute(INDEX_ENDPOINT, IndexRouter);
    })

    
    it("Should generate valid auth tokens for registered users",()=>{
        // return new Promise((resolve)=>{
        userRepository.deleteUser({email: userLoginCredentials.username}).then(async()=>{

            try{

                const { email, password } = userCredentials;
        
                const response  = await Axios({
                    method:'post',
                    url: "http://127.0.0.1"+REGISTER_USER_ENDPOINT,
                    data:{
                        email,
                        password
                    },
                });
                    
                
                const {data} = response.data;
        
                const { authToken } = data;

                console.log(`AUTH_TOKEN: ${JSON.stringify(authToken)}`);
        
                new JWTTokenAuthAlgorithm().verify( authToken.accessToken, (err:any, validatedToken:string)=>{
                    expect(err).to.equal(null);
                    expect(validatedToken).to.be("string");
                });

                new JWTTokenAuthAlgorithm().verify( authToken.refreshToken, (err:any, validatedToken:string)=>{
                    expect(err).to.equal(null);
                    expect(validatedToken).to.be("string");
                });
        
            }catch(e){
                console.log(e);
            }
        });
        
        // });
    });

    after(()=>{
        webServer.close();
    })
});