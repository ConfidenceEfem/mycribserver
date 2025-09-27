
import { RequestHandler } from "express";
import { allAgents, currentUserData, getOneUser, resetPassword, updateUserProfile, uploadAvatar } from "../../services/user/user.service";

export const UploadAvatar : RequestHandler = (req,res,next) => uploadAvatar(req,res,next)
export const UpdateUserProfile : RequestHandler = (req,res,next) => updateUserProfile(req,res,next)
export const CurrentUserData : RequestHandler = (req,res,next) => currentUserData(req,res,next)
export const ResetPassword : RequestHandler = (req,res,next) => resetPassword(req,res,next)
export const GetOneUser : RequestHandler = (req,res,next) => getOneUser(req,res,next)
export const AllAgents : RequestHandler = (req,res,next) => allAgents(req,res,next)
