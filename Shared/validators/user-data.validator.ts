export class UserDataValidator{
    public static isValidPassword(password:string):boolean{
        // Source => https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
        var regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[/\\!@#\$%\^&\*])(?=.{8,})");
        return regex.test(password);
    }

    public static isValidUsername(username:string):boolean{
        // Source => https://stackoverflow.com/a/12019115/14788740
        var regex = new RegExp("^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$");
        return regex.test(username);
    }

    public static isValidNickname(nickname:string):boolean{
        var regex = new RegExp("[A-Za-z0-9]{4,20}");
        return regex.test(nickname);
    }
}