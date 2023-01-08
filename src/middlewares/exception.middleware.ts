import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { HttpException } from '../exception/exception.error';

export class ExceptionMiddleware {

    execute(err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) {
        console.log(err);

        if(err instanceof HttpException) {
            res.status(err.status).json({message: err.message, errors: err.errors})
            return
        }
        res.status(500).json({message: 'Ошибка Сервера'})
    }
}