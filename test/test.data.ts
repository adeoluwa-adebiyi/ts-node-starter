import { expect } from "chai"

export const claims = {
    "sub": "1234567890",
    "name": "John Doe",
    "iat": Date.now()/1000
}

export const passwordTestData: string = "Zen039y635";
export const invalidArgon2PasswordHash = "1234";