import {DataSource} from 'typeorm'
import { configService } from '../config/config.service'
import path from 'path'


function envVarDB() {
  const DB_URL = configService.get('DB_URL');
  return {
    DB_URL
  }
}

class DataBase {
    readonly sourse: DataSource

    constructor() {
    const {DB_URL} = envVarDB()

        this.sourse = new DataSource({
            type: 'postgres',
            url: process.env.DB_URL || DB_URL,
            entities: [path.join(__dirname, '../entity/*{.js,.ts}')],
            synchronize: true
        })
    }

    public async initialize(): Promise<void> {
        try {
            await this.sourse.initialize();
            console.log('[DataBase] Connected successfully');
        }catch(e) {
            console.log('[DataBase] ' + e );
        }
    }

}


export const dataBase = new DataBase()