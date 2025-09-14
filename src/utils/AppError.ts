export enum HttpCode {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500
}

interface ErrorArgs {
    message: string,
    httpCode: HttpCode,
    isOperational?: boolean,
    name?: string
}

export class AppError extends Error {

    public readonly name : string
    public readonly httpCode : HttpCode
    public readonly isOperational : boolean = true
    

    constructor(args: ErrorArgs){
        super(args.message)

        Object.setPrototypeOf(this, new.target.prototype)

        this.httpCode = args.httpCode
        if(args.isOperational !== undefined){
            this.isOperational = args.isOperational
        }
        this.name = args.name || "ERROR"

        Error.captureStackTrace(this)
    }
}