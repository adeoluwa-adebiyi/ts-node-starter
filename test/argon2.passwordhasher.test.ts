import "reflect-metadata";
import { expect } from "chai";
import { Argon2Hasher } from "../app/common/auth/hashers/argon2.hasher";
import argon2 from "argon2";
import { Argon2PasswordHasher } from "../app/common/auth/hashers/argon2.passwordhasher";
import { passwordTestData, invalidArgon2PasswordHash } from "./test.data";

const argon2PasswordHasher: Argon2PasswordHasher = new Argon2PasswordHasher();
const data = passwordTestData;
const invalidHash = invalidArgon2PasswordHash; 

describe("Tests Argon2 password hasher utility", ()=>{

    it("Should correctly hash passwords", async()=>{
        expect(await argon2.verify(await argon2PasswordHasher.hashPassword(passwordTestData), passwordTestData)).to.equal(true);
    });

    it("Should correctly detect correct password hashes", async()=>{
        expect(await argon2PasswordHasher.verifyPassword(await argon2.hash(passwordTestData), passwordTestData)).to.equal(true);
    });

    it("Should correctly detect wrong password hashes", async()=>{
        expect(await argon2PasswordHasher.verifyPassword(invalidHash, passwordTestData)).to.equal(false);
    });

})