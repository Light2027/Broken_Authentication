import {IIdentifiable} from "../interfaces/identifiable.interface";

export const DEFAULTPFP = "default-profile-picture.jpg";

export class UserData implements IIdentifiable{
    public id:string;
    public nickname: string;
    public profilePicture:string;

    /**The Password is null when the user ask for the user data using the AccessToken */
    constructor(public username:string, public password:string|null){
        this.id = "";
        this.nickname = "Alpharius";
        this.profilePicture = DEFAULTPFP;
    }
}