import { createLodge, deleteOneLodge } from "src/services/listing/listing.service";

import { RequestHandler } from "express";

export const RegisterLodge : RequestHandler = (req,res,next) => createLodge(req,res,next)
export const DeleteOneLodge : RequestHandler = (req,res,next) => deleteOneLodge(req,res,next)
