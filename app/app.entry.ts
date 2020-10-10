import "./appregistry.registry";
import spdy from "spdy";
import express, { Request, Response, Router } from "express";
import { RoutableWebServerSpec, WebServerSpec } from "./server/contracts/webserverspec.interface";
import { ExpressWebServer } from "./server/express.webserver";
import { container as di } from "tsyringe";
import {env} from "custom-env";
import process from "process";
import { PORT, HOST, DB_URI } from "./config/app.config"


const httpServer: RoutableWebServerSpec = di.resolve("RoutableWebServerSpec");
const routeHandler:any = Router();
routeHandler.get("/test", (req:Request, res:Response)=>{
  res.send("Hello World");
})
httpServer.addRoute("/", routeHandler);
httpServer.listen(parseInt(PORT.toString()), HOST);