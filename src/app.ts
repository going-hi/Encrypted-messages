import { IController } from './types/controller.interface'
import express, { Router } from 'express';
import { ExceptionMiddleware } from './middlewares/exception.middleware';
import hbs from 'hbs'
import path from 'path';

export class App {
    readonly application: express.Application
    private readonly port: number
    private readonly mainRouter: Router

    constructor(constrollers: IController[], port:  number){
        this.application = express()
        this.port = port
        this.mainRouter = Router()

        // * initialize
        this.initializeMiddlewares()
        this.initializeHbs()
        this.initializeControllers(constrollers)
        this.application.use('/', this.mainRouter)
        this.initializeErrorHandler()
    }

    private initializeMiddlewares() {
        this.application.use(express.json())
        this.application.use(express.urlencoded({extended: false}))
        this.application.use(express.static(path.join(__dirname, '../public')))
    }

    private initializeErrorHandler() {
        this.application.use(new ExceptionMiddleware().execute)
    }

    private initializeControllers(controllers: IController[]) {
        controllers.forEach(controller => {
            this.mainRouter.use(controller.path, controller.router)
        })
    }

    private initializeHbs() {
        this.application.set('view engine', 'hbs')
        this.application.set("views", path.join(__dirname, '../views'))
        hbs.registerPartials(path.join(__dirname, '../views/partials'))
    }

    public start() {
        this.application.listen(this.port, () => console.log(`Server started on port ${this.port}`))
    }

}