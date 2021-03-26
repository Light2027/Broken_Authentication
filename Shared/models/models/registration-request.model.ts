export class RegistrationRequest{
    public nickname: string;
    constructor(public username:string, public password:string){
        this.nickname = "";
    }
}