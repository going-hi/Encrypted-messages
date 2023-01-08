import {config, DotenvParseOutput} from 'dotenv'

class ConfigService {
    private config: DotenvParseOutput;

    constructor() {
        const result = config();

        if(result.error) {
            console.error('[Config] Failed to read .env', result.error);
        }else {
            this.config = result.parsed as DotenvParseOutput;
            console.log('[Config] .env config loaded successfully');
        }
    }

    public get(key: string): string {
        return this.config[key];
    }
}


export const configService = new ConfigService();