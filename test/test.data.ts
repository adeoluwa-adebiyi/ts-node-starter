import { expect } from "chai"
import "reflect-metadata";
import "../app/appregistry.registry";
import { container } from "tsyringe";
import { PasswordHasherSpec } from "../app/common/core/hashers/contract/hasher.interface";

export const claims = {
    "sub": "1234567890",
    "name": "John Doe",
    "iat": Date.now()/1000
}

const passwordHasher: PasswordHasherSpec = container.resolve("PasswordHasherSpec");

export const passwordTestData: string = "Zen039y635";
export const invalidArgon2PasswordHash = "1234";
export const KNEX_SQL_CONNECTION_URL = "../sqlite.db";
export const KNEX_SQL_INVALID_CONNECTION_URL = "../invalidDB.db";
export const POSTGRES_SQL_CONNECTION_URL  = "";
export const POSTGRES_SQL_INVALID_CONNECTION_URL  = "";
const userPassword = "jenny.jones";
export const USER_REGISTRATION_CREDENTIALS = {
    firstname: "Germain",
    lastname: "Jones",
    dob: "5-06-1968",
    email:"gi.jones@yahoo.com",
    password: userPassword,
    passwordHash: passwordHasher.hashPassword(userPassword)
};