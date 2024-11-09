import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateUserDto { }


export class UserRegisterDto {

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}

export class UserUpdateDto {

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsOptional()
    password?: string | undefined | null
}



export class RequestChangePasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string
}

export class ValidateChangePasswordTokenDto {
    @IsString()
    @IsNotEmpty()
    token: string
}

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    token: string

    password: string
}