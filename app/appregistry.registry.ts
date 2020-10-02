import "reflect-metadata";
import {container, InjectionToken} from "tsyringe";
import { AuthenticationSpec } from "./server/contracts/authenticationspec.interface";
import { TokenAuthSpec } from "./server/contracts/tokenauthspec.interface";
import { RoutableWebServerSpec } from "./server/contracts/webserverspec.interface";
import { JWTTokenAuthAlgorithm } from "./server/core/jwt-token.token-auth";
import { JWTAuthentication } from "./server/authentication/jwt.authication";

import { ExpressWebServer } from "./server/express.webserver";
import express from "express";
import secure from "secure-random";
import { Argon2PasswordHasher } from "./common/auth/hashers/argon2.passwordhasher";
import { Argon2Hasher } from "./common/auth/hashers/argon2.hasher";
import { PasswordHasherSpec } from "./common/auth/hashers/contract/hasher.interface";

const APP_SECRET = "9B33B815C7E4CBC32CB04CCF7ABCB34E51000DE072241D698E3F7C797912E7A9";

container.register<RoutableWebServerSpec>("RoutableWebServerSpec", {useClass: ExpressWebServer});
container.register<TokenAuthSpec>("TokenAuthSpec", {useValue: new JWTTokenAuthAlgorithm(APP_SECRET)});
container.register<AuthenticationSpec<express.RequestHandler>>("AuthenticationSpec<<express.RequestHandler>>", {useClass: JWTAuthentication});
container.register<PasswordHasherSpec>("PasswordHasherSpec", { useValue: new Argon2PasswordHasher()});
