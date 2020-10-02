import { AuthenticatedWebServerSpec, RoutableWebServerSpec } from "./contracts/webserverspec.interface";
import express, {Express, RequestHandler, RequestParamHandler} from "express";
import { AuthenticationSpec } from "./contracts/authenticationspec.interface";
import { Server } from "http";
import { inject, injectable } from "tsyringe";


@injectable()
export class ExpressWebServer implements AuthenticatedWebServerSpec<RequestHandler>{

    private app: Express;
    private _options:any;
    private auth: RequestHandler = null;
    private server: Server = null;

    get options(): any{
        return this._options;
    }

    constructor(@inject("AuthenticationSpec<<express.RequestHandler>>") authentication: AuthenticationSpec<express.RequestHandler>){
        this.app = express();
        this.auth = authentication?.provideAuthentication();
    }

    configureAuthentication(authentication: AuthenticationSpec<express.RequestHandler>): AuthenticatedWebServerSpec<RequestHandler> {
        this.auth = authentication.provideAuthentication();
        return this;
    }

    close(): boolean {
       this.server = this.server.close((err)=>{
           if(err){
               return false;
           }
           return true;
       });
       return true;
    }

    listen(port: number, address: string): void {
        this.server = this.app.listen(port, address);
    }

    configure(options: any): RoutableWebServerSpec {
        this._options = options;
        return this;
    }

    addRoute(path: string, routeHandler: any): RoutableWebServerSpec {
        this.app.use(path ,this.auth, routeHandler);
        return this;
    }

}