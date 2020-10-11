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

import { Argon2PasswordHasher } from "./common/core/hashers/argon2.passwordhasher";
import { PasswordHasherSpec } from "./common/core/hashers/contract/hasher.interface";
import { UserRepositorySpec } from "./data/repositories/repository.interface";
import { KnexUserRepository } from "./data/repositories/knex/user.repository";
import { getEffectiveConstraintOfTypeParameter } from "typescript";
import { DatabaseSpec } from "./data/datasources/datasource.interface";
import { KnexClient, KnexSqlDatabase } from "./data/datasources/knexsql.database";
import { PORT, HOST, DB_URI, SECRET, DB_HOST, DB_PORT, DB_USERNAME, DB_NAME, DB_PASSWORD } from "./config/app.config"
import { PostgresDatabase } from "./data/datasources/postgres.database";
import { PgSQLUserRepository } from "./data/repositories/postgresql/user.repository";

const APP_SECRET = SECRET;
const DATABASE = new PostgresDatabase();

DATABASE.setConnection(DB_HOST, Number(DB_PORT), DB_USERNAME, DB_NAME, DB_PASSWORD);

container.register<DatabaseSpec>("DatabaseSpec", {useValue: DATABASE});
container.register<UserRepositorySpec>("UserRepositorySpec", { useClass: PgSQLUserRepository});
container.register<RoutableWebServerSpec>("RoutableWebServerSpec", {useClass: ExpressWebServer});
container.register<TokenAuthSpec>("TokenAuthSpec", {useValue: new JWTTokenAuthAlgorithm(APP_SECRET)});
container.register<AuthenticationSpec<express.RequestHandler>>("AuthenticationSpec<<express.RequestHandler>>", {useClass: JWTAuthentication});
container.register<PasswordHasherSpec>("PasswordHasherSpec", { useValue: new Argon2PasswordHasher()});


//Database
// container.register<DatabaseSpec>("DatabaseSpec", {useValue: new KnexSqlDatabase(KnexClient.POSTGRESQL, DB_URI)})
