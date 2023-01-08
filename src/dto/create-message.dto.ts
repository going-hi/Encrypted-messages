import {IsString, MinLength, MaxLength, IsOptional} from 'class-validator'

export class CreateMessageDto {

    @IsString()
    message: string

    code: string
    @IsOptional()
    @IsString()
    @MinLength(0)
    @MaxLength(200)
    description?: string

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string

    iv: string
}