import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAuthDto {

}


export class LoginDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}


export class ValidateDto {
    @IsString()
    @IsNotEmpty()
    token: string
}