import { Serializable } from "../../common/contracts/serializable.interface";

export interface UserJSON{
    id: number;

    firstname: string;

    lastname: string;

    dob: Date;
}

export class UserModel implements Serializable<UserModel>{

    private id: number;

    private firstname: string;

    private lastname: string;

    private dob: Date;

    constructor(id:number=null, firstname: string=null, lastname: string=null, dob: Date=null){
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.dob = dob;
    }

    toJSON(): any {
        return {
            id: this.id,
            firstname: this.firstname,
            lastname: this.lastname,
            dob: this.dob
        } 
    }
    
    fromJSON(json: any): UserModel {
        return new UserModel(json.id, json.firstname, json.lastname, json.dob);
    }
}