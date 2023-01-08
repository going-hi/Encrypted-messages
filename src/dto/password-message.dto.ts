import {IsString, MinLength, MaxLength} from 'class-validator'

export class PasswordMessageDto {

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string
}