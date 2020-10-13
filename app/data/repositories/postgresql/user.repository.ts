import { connect } from "http2";
import { Client } from "pg";
import { autoInjectable, inject, injectable } from "tsyringe";
import { getAutomaticTypeDirectiveNames, transform } from "typescript";
import { ObjectNotFoundException } from "../../../common/exceptions/object-not-found.exception";
import { UserAuthId, UserModel, UserWithAuthCredJSON } from "../../../domain/entities/user.model";
import { InvalidArgumentsException } from "../../../common/exceptions/invalid-arguments.exception";
import { RegisterUserUsecaseParams } from "../../../domain/usecases/register-user.usecase";
import { DatabaseSpec } from "../../datasources/datasource.interface";
import { UserRepositorySpec } from "../repository.interface";


const USER_TABLE = "bb";
const DELETE_USER_BY_EMAIL_QUERY = `DELETE FROM "${USER_TABLE}" WHERE email = $1`;
const DELETE_USER_BY_ID_QUERY = `DELETE FROM "${USER_TABLE}" WHERE id = $1`;
const GET_USER_BY_ID_QUERY = `SELECT * FROM "${USER_TABLE}" WHERE id = $1`;
const GET_USER_BY_EMAIL_QUERY = `SELECT * FROM "${USER_TABLE}" WHERE email = $1`;
const GET_ALL_USERS_QUERY = `SELECT * FROM "${USER_TABLE}"`;
const CREATE_NEW_USER_QUERY = `INSERT into "${USER_TABLE}"(firstname, lastname, dob, email, passwordhash) VALUES($1, $2, $3, $4, $5) RETURNING *`;


export const transformDbResultToObject = (resultArray: Array<any>): UserWithAuthCredJSON =>{
    return {
        id: resultArray[0],
        firstname: resultArray[1],
        lastname: resultArray[2],
        email: resultArray[3],
        dob: resultArray[4],
        passwordHash: resultArray[5]
    }
}


@autoInjectable()
@injectable()
export class PgSQLUserRepository implements UserRepositorySpec{

    constructor(@inject("DatabaseSpec")private database?: DatabaseSpec){
    }


    async deleteUser(userCredentials: UserAuthId): Promise<void> {

        const { email, id } = userCredentials;

        if(!userCredentials)
            throw new InvalidArgumentsException("UserAuthId must not be null");

        if(!email && !id)
            throw new InvalidArgumentsException("email and id cannot both be null");

        if(email)
            await ((this.getDatabaseConnector()).query(DELETE_USER_BY_EMAIL_QUERY,[email]));

        if(id)
            await ((this.getDatabaseConnector()).query(DELETE_USER_BY_ID_QUERY,[id]));
    }

    async getUserById(userId: UserAuthId): Promise<UserModel> {
        const {email, id } = userId;
        if(id){
            const response = await ((this.getDatabaseConnector())).query(GET_USER_BY_ID_QUERY,[id]);
            if(!response || response.rows.length===0)
                throw new ObjectNotFoundException(`User with id ${id} does not exist`);

            return new UserModel().fromJSON(( response.rows[0] ));
        }

        if(email){
            const response = await ((this.getDatabaseConnector())).query(GET_USER_BY_EMAIL_QUERY,[email]);
            if(!response || response.rows.length===0)
                throw new ObjectNotFoundException(`User with id ${email} does not exist`);
 
            return new UserModel().fromJSON(response.rows[0]);
        }
        
    }

    async createUser(userCredentials: UserWithAuthCredJSON): Promise<UserModel> {
        try{
            const { firstname, lastname, dob, email, passwordHash } = userCredentials;
            return new UserModel().fromJSON( (await (this.getDatabaseConnector().query(CREATE_NEW_USER_QUERY,[ firstname, lastname, dob, email, passwordHash ]))).rows[0]);
        }catch(e){
            console.log(e);
        }
    }
    
    getDatabaseConnector(): Client {
        return this.database.getConnector();
    }

}