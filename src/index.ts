import { App } from "./app";
import { configService } from "./config/config.service";
import { dataBase } from "./dataBase/dataBase.service";
import { messageController } from './message/message.controller';

const PORT =  Number(process.env.PORT || configService.get('PORT'))

const app = new App(
    [
        messageController
    ],
    PORT
)


async function start() {
    try {
        await dataBase.initialize()
        app.start()
    }catch(e) {
        console.error(e);
    }
}

start()