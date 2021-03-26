export class UpdatePasswordRequest{
    constructor(public oldPassword:string, public newPassword:string|null){
    }
}