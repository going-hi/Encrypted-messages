import crypto, { createDiffieHellmanGroup } from 'crypto'
import util from 'util'
import { configService } from '../config/config.service'

const KEY = configService.get('KEY')
const ALGORITHM = configService.get('ALGORITHM')


type encryptionObject  = {
    iv: string
    string: string
}

class MCrypt {
    private algorithm = ALGORITHM

    async hash(text: string, salt?: string): Promise<string> {
        const saltInUse = salt || crypto.randomBytes(16).toString('hex')
        const hashBuffer = await util.promisify(crypto.scrypt)(text, saltInUse, 32) as Buffer
        return `${hashBuffer.toString('hex')}:${saltInUse}`
    }

    async compareHash(text: string, hash: string): Promise<boolean> {
        const [, salt] = hash.split(':')

        return await this.hash(text, salt) === hash
    }

    encryption(text: string): encryptionObject {
        const iv = crypto.randomBytes(8).toString('hex')
        const cipher = crypto.createCipheriv(this.algorithm, KEY, iv)

        let encrypted = cipher.update(text, 'utf-8', 'hex')
        encrypted += cipher.final('hex')

        return {
            string: encrypted, iv
        }
    }

    decipher(encryption: string, iv: string): string {
       const decipher = crypto.createDecipheriv(this.algorithm, KEY, iv)
       let decrypted = decipher.update(encryption, 'hex', 'utf-8',)
       decrypted += decipher.final('utf-8')

       return decrypted
    }

}

export const mCrypt = new MCrypt()

