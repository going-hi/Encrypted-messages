import { Router, Request, Response, NextFunction } from 'express';
import { IController } from '../types/controller.interface';
import { messageService } from './message.service';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
import { CreateMessageDto } from '../dto/create-message.dto';
import { PasswordMessageDto } from '../dto/password-message.dto';

class MessageController implements IController {
    path = '/'
    router = Router();

    constructor() {
        this.initializeRouters()
    }

    private initializeRouters() {
        this.router.post('/message', new ValidationMiddleware(CreateMessageDto).execute, this.create)
        this.router.post('/:code', new ValidationMiddleware(PasswordMessageDto).execute, this.getMessage)
        this.router.get('/:code', this.getMessagePage)
        this.router.get('/', this.createMessagePage)
    }

    private create = async (req: Request<{}, {}, Pick<CreateMessageDto, 'description' | 'password'| 'message'>>, res: Response, next: NextFunction) => {
        try {
            const code = await messageService.create(req.body)
            res.status(201).json({code})
        }catch(e) {
            next(e)
        }
    }


    private getMessage = async (req: Request<{code: string}, {}, {password: string}>, res: Response, next: NextFunction) => {
        try {
            const code = req.params.code
            const password = req.body.password
            const message = await messageService.getMessage(password, code)
            res.json(message)
        }catch(e) {
            next(e)
        }
    }

    private getMessagePage = async (req: Request<{code: string}>, res: Response, next: NextFunction) => {
        try {
            const code = req.params.code
            const info = await messageService.getInfoMessage(code)
            if(!info) {
                return res.render('not-found', {code})
            }
            res.render('message', {code, ...info})
        }catch(e) {
            next(e)
        }
    }

    private createMessagePage = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            res.render('create-message')
        }catch(e) {
            next(e)
        }
    }
}


export const messageController = new MessageController()