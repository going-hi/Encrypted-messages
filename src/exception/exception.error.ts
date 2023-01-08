export class HttpException extends Error {

    status: number
    errors: object[]

    constructor(status: number, message: string, errors: object[] = []){
        super(message)
        this.status = status
        this.message = message
        this.errors = errors
    }

    static BadRequest(message: string, errors: object[] = []) {
        return new HttpException(400, message, errors)
    }
}