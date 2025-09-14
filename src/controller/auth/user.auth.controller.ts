import { updateTokens } from "../../services/auth/token.service";
import {  changePassword, forgetPassword, loginUser,  registerUser, resendOtp, verifyEmail } from "../../services/auth/user.auth.service";
import { RequestHandler } from "express";

export const RegisterANewUser : RequestHandler = (req,res,next) => registerUser(req,res,next)
export const LoginAUser : RequestHandler = (req,res,next) => loginUser(req,res,next)
export const ResendUserOTP : RequestHandler = (req,res,next) => resendOtp(req,res,next)
export const VerifyUserEmail : RequestHandler = (req,res,next) => verifyEmail(req,res,next)
export const updateRefreshToken : RequestHandler = (req,res,next) => updateTokens(req,res,next)
export const ForgetPassword : RequestHandler = (req,res,next) => forgetPassword(req,res,next)
export const ChangePassword : RequestHandler = (req,res,next) => changePassword(req,res,next)
