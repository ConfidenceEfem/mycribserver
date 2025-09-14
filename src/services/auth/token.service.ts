import { NextFunction, Request, Response } from "express"
import { EnvironmentalVariables } from "../../config/environmentalVariables"
import { AppError, HttpCode } from "../../utils/AppError"
import jwt from "jsonwebtoken"
import { AsyncHandler } from "../../utils/AsyncHandler"
import { IUserToken } from "../../interface/user.token.interface"

  declare global {
    namespace Express {
      interface Request {
        user?: IUserToken;
      }
    }
  }

export const createAccessToken = (payload: Object) => {
   const accessToken = jwt.sign(payload, EnvironmentalVariables.JWT_SECRET as string, {expiresIn: "1d"})
   return accessToken
}

export const createRefreshToken = (payload: Object) => {
    const refreshToken = jwt.sign(payload, EnvironmentalVariables.JWT_SECRET as string, {expiresIn: "7d"})
    return refreshToken 
}

// verify access token
export const verifyAcessToken = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization

    if(!accessToken){
        throw new AppError({
            name: "UnauthorizedError",
            message: "Access token is missing",
            httpCode: HttpCode.UNAUTHORIZED,
            isOperational: true
        })
    }

    const getAccessToken = accessToken.split(" ")[1]

    if(!getAccessToken){
        throw new AppError({
            name: "Couldn't find access token",
            message: "Token is not provided",
            httpCode: HttpCode.BAD_REQUEST,
            isOperational: true,
        })
    }

    jwt.verify(getAccessToken, EnvironmentalVariables.JWT_SECRET as string, (err , payload) => {
        if(err){
            throw new AppError({
                name: err.name,
                message: err.message,
                httpCode: HttpCode.UNAUTHORIZED,
                isOperational: true
            })
        }

        req.user = payload as IUserToken

        next()
    })

})
// verify refresh token
export const verifyRefreshToken = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.headers.authorization

    if(!refreshToken){
        throw new AppError({
            name: "UnauthorizedError",
            message: "Refresh token is missing",
            httpCode: HttpCode.UNAUTHORIZED,
            isOperational: true
        })
    }

    const getrefreshToken = refreshToken.split(" ")[1]

    if(!getrefreshToken){
        throw new AppError({
            name: "Couldn't find refresh token",
            message: "Token is not provided",
            httpCode: HttpCode.BAD_REQUEST,
            isOperational: true,
        })
    }

    jwt.verify(getrefreshToken, EnvironmentalVariables.JWT_SECRET as string, (err , payload) => {
        if(err){
            throw new AppError({
                name: err.name,
                message: err.message,
                httpCode: HttpCode.UNAUTHORIZED,
                isOperational: true
            })
        }

        req.user = payload as IUserToken

        next()
    })

})

export const updateTokens = AsyncHandler(async (req: Request, res: Response) => {


      const { exp, iat, ...userPayload } = req.user as any;

    const accessToken = createAccessToken(userPayload)
    
    const refreshToken = createRefreshToken(userPayload)

    return res.status(HttpCode.OK).json({
        message: "Token refreshed successfully",
        token: {
            accessToken,
            refreshToken
        }
    })
})