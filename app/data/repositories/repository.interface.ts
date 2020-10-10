import { UserAuthId, UserModel } from "../../domain/entities/user.model";

export interface BaseRepository{
    getDatabaseConnector():any;
}

export interface UserRepositorySpec extends BaseRepository{

    deleteUser(userCredentials: any): Promise<void>;

    getUserById(id:UserAuthId): Promise<UserModel>;

    createUser(userCredential: any): Promise<UserModel>;

}