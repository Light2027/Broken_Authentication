import { AbstractControl, ValidatorFn } from "@angular/forms";
import {UserDataValidator} from "../../../../../Shared/validators/user-data.validator";

export function PasswordValidator() : ValidatorFn{
    return (control: AbstractControl) : {[key: string]: any} | null => {
        return UserDataValidator.isValidPassword(control.value) ? null : {isWeak:true};
    };
}

export function UsernameValidator() : ValidatorFn{
    return (control: AbstractControl) : {[key: string]: any} | null => {
        return UserDataValidator.isValidUsername(control.value) ? null : {invalidUsername:true};
    };
}

export function NicknameValidator() : ValidatorFn{
    return (control: AbstractControl) : {[key: string]: any} | null => {
        return UserDataValidator.isValidNickname(control.value) ? null : {invalidNickname:true};
    };
}