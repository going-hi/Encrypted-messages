import { CreateMessageDto } from '../dto/create-message.dto';
import shortid from 'shortid';
import { mCrypt } from '../mCrypt/mCrypt';
import { dataBase } from '../dataBase/dataBase.service';
import { Message } from '../entity/Message.entity';
import { HttpException } from '../exception/exception.error';


type MessageType = {
  message: string
  description: string
}

type InfoMessageType = {
  description: string
  views: number
}

class MessageService {
    private repository = dataBase.sourse.manager.getRepository(Message)

    async create(dto: Pick<CreateMessageDto, 'description' | 'password'| 'message'>): Promise<string> {
        const code = shortid.generate()
        const encryptedMessage = mCrypt.encryption(dto.message)
        const hashPassword =  await mCrypt.hash(dto.password)

        const message = this.repository.create({
          ...dto,
          password: hashPassword,
          code,
          message: encryptedMessage.string,
          iv: encryptedMessage.iv
        })

        await this.repository.save(message)
        return message.code
    }

    async getMessage(password: string, code: string): Promise<MessageType> {
        const encryptedMessage = await this.repository.findOne({
            where: {
                code
            }
        })

        if(!encryptedMessage){
            throw HttpException.BadRequest('Сообщение не найдено')
        }

        const compare = await mCrypt.compareHash(password, encryptedMessage.password)
        if(!compare){
            throw HttpException.BadRequest('Пароль неверный')
        }

        const content = mCrypt.decipher(encryptedMessage.message, encryptedMessage.iv)

        return {message: content, description: encryptedMessage.description}
    }

    async getInfoMessage(code: string): Promise<InfoMessageType | null> {
        const message = await this.repository.findOne({
            where: { code },
        })

        if(!message) {
            return null
        }
        message.views++
        const messageNew = await this.repository.save(message)
        return {
            description: messageNew.description,
            views: messageNew.views
        }
    }
}



export const messageService = new MessageService()