import { env } from "custom-env";
import { Client } from "ts-postgres";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from  "./app/config/app.config";
import { PostgresDatabase } from "./app/data/datasources/postgres.database";
env("dev");

const db: PostgresDatabase = new PostgresDatabase();
db.setConnection(DB_HOST, Number(DB_PORT), DB_USERNAME, DB_NAME, DB_PASSWORD);

(async()=>{
    await db.connect();
    console.log(await db.getConnector().query(`SELECT * FROM "app-user"`).rows);
})();