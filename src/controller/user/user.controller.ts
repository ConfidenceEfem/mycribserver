
import { RequestHandler } from "express";
import { uploadAvatar } from "src/services/user/user.service";

export const UploadAvatar : RequestHandler = (req,res,next) => uploadAvatar(req,res,next)
