import { AppError, HttpCode } from "../../utils/AppError"
import { Request, Response } from "express"


const devErrorHandler = (err: AppError, req: Request, res: Response) => {
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({err: err, stack: err.stack, name: err.name, message: err.message})
}

export const ErrorHandler = (err: AppError, req: Request, res: Response) => {
    if (process.env.NODE_ENV === "development") {
        return devErrorHandler(err, req, res)
    }


    // In production, we don't want to expose the stack trace
     res.status(err?.httpCode || HttpCode?.INTERNAL_SERVER_ERROR).json({
        name: err.name,
        message: err.message,
        httpCode: err.httpCode,
        isOperational: err.isOperational
    })
}