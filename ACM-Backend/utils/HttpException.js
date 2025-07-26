export class HttpException extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = 'HttpException';
        Error.captureStackTrace(this, this.constructor);
    }
}
