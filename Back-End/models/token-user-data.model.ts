export class TokenUserData{
    constructor(public userName:string){}
}


/**
 * Some morron thought it to be a good idea not to put the data contained within the jwt token into a payload property, so you need this method...
 * @export
 * @param {TokenUserData} tokenData
 * @return {TokenUserData}  {TokenUserData}
 */
export function removeJunk(tokenData:TokenUserData):TokenUserData{
    return new TokenUserData(tokenData.userName);
}