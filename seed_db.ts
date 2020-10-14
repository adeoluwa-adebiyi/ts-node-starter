import fs from "fs";
import path from "path";

import { env } from "custom-env";
import { Client } from "pg";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from  "./app/config/app.config";
import { PostgresDatabase } from "./app/data/datasources/postgres.database";
import { exit } from "process";
import { DatabaseSpec } from "./app/data/datasources/datasource.interface";


// env("dev");

const TABLE_NAME = "bb";

// const db: PostgresDatabase = new PostgresDatabase();

// db.setConnection(DB_HOST, Number(DB_PORT), DB_USERNAME, DB_NAME, DB_PASSWORD);


export const seedDB = (async(db: DatabaseSpec)=>{

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
                await db.getConnector().query(`INSERT into ${TABLE_NAME}(firstname, lastname, dob, email, passwordhash) VALUES( $1, $2, $3, $4, $5 )`, values);
            }
            db.getConnector().query("commit;").then(async (onfulfilled:any)=>{
                exit(0);
            })
        }
    });

});


export const emptyDB = async(db: DatabaseSpec)=>{
    await db.connect();

    await db.getConnector().query(`DELETE FROM ${TABLE_NAME}`);
}


export const  closeDBClientConnection = async(db: DatabaseSpec): Promise<void> =>{
    await (<Client>db.getConnector()).end();
}