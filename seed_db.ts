import fs from "fs";
import path from "path";

import { env } from "custom-env";
import { Client } from "pg";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from  "./app/config/app.config";
import { PostgresDatabase } from "./app/data/datasources/postgres.database";
import { exit } from "process";


env("dev");

const TABLE_NAME = "bb";

const db: PostgresDatabase = new PostgresDatabase();
db.setConnection(DB_HOST, Number(DB_PORT), DB_USERNAME, DB_NAME, DB_PASSWORD);

(async()=>{

    await db.connect();

    await db.getConnector().query(`DELETE FROM ${TABLE_NAME}`);

    fs.readFile(path.resolve("./app/data/fixtures/users.fixture.json"),async (err, data)=>{
        if(err){
            console.log("Fixture export failed")
        }else{
            const json = JSON.parse(data.toString());
            await db.getConnector().query("begin;")
            for(let data of json["users"]){

                const { firstname, lastname, dob, email, passwordHash="djdjjd" } = data;
                const values = [firstname,lastname,dob,email,passwordHash];
                await db.getConnector().query(`INSERT into ${TABLE_NAME}(firstname, lastname, dob, email, passwordhash) VALUES( $1, $2, $3, $4, $5 )`, values, (err, res)=>{

                });
            }
            db.getConnector().query("commit;").then(async onfulfilled=>{
                exit(0);
            })
        }
    });

})();