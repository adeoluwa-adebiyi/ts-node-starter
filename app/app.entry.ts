import "./appregistry.registry";
import spdy from "spdy";
import express, { Request, Response, Router } from "express";
import { RoutableWebServerSpec, WebServerSpec } from "./server/contracts/webserverspec.interface";
import { ExpressWebServer } from "./server/express.webserver";
import { container as di } from "tsyringe";
import customEnv from "custom-env";
import process from "process";

customEnv.env("dev");

const {PORT, ADDRESS } = process.env;

const httpServer: RoutableWebServerSpec = di.resolve("RoutableWebServerSpec");
const routeHandler:any = Router();
routeHandler.get("/test", (req:Request, res:Response)=>{
  res.send("Hello World");
})
httpServer.addRoute("/", routeHandler);
httpServer.listen(parseInt(PORT.toString()), ADDRESS);



// spdy.createServer({}, app).listen(3000, () => {

//     console.log('Listening on port: ' + 3000 + '.');
// });