import { Client } from "pg";
import { ConnectionOptions } from "tls";
import { InvalidArgumentsException } from "../../common/exceptions/invalid-arguments.exception";
import { CredentialDatabase, UrlDatabase } from "./datasource.interface";
import fs from "fs";

export class PostgresDatabase implements CredentialDatabase<Client>{

    private client: Client;
    private url: string;
    private host: string;
    private port: number;
    private user: string;
    private database: string;
    private password: string

    get connectionURL(): any{
        return {
            host: this.host,
            port: this.port,
            user: this.user,
            database: this.database,
            password: this.password
        };
    };

    setConnection(host: string, port: number, user: string, database: string, password: string): void {
        this.host = host;
        this.port = port;
        this.user = user;
        this.database = database;
        this.password = password;
    }

    async connect() {
        if(!this.host)
            throw new InvalidArgumentsException("database host cannot be null!");

        if(!this.port)
            throw new InvalidArgumentsException("database port cannot be null!");

        if(!this.user)
            throw new InvalidArgumentsException("database user cannot be null!");

        // if(!this.database)
        //     throw new InvalidArgumentsException("database name cannot be null!");

        if(!this.password)
            throw new InvalidArgumentsException("database password cannot be null!");

        this.client = new Client({
        host: this.host,
        port: this.port,
        user: this.user,
        database: this.database,
        password: this.password,
        ssl:true,
        // ssl: {
        //     ca: fs.readFileSync(__dirname + '/ca-certificate.crt'),
        // }
        // keepAlive: false
       })

       return await this.client.connect();
    }
    
    getConnector():Client {
        return this.client;
    }
}