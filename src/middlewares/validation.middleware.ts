import { NextFunction, Request, Response } from 'express'
import {plainToClass} from 'class-transformer'
import {validate} from 'class-validator'
import { HttpException } from '../exception/exception.error';

export class ValidationMiddleware<T extends object> {

    classDto: new (...args: any[]) => T

    constructor(classDto: new (...args: any[]) => T) {
        this.classDto = classDto
    }

    execute = async (req: Request, res: Response, next: NextFunction) => {
        const plain = plainToClass(this.classDto, req.body)

        const errors = await validate(plain)
        if(errors.length) {
            next(HttpException.BadRequest('Ошибка в валидации', errors))
        }else{
            next()
        }

    }


}