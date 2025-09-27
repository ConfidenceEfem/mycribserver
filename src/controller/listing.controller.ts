import {  allLodgeByOneUser, deleteOneLodge, getAllLodge, newLodge } from "../services/listing/listing.service";

import { RequestHandler } from "express";

export const DeleteOneLodge : RequestHandler = (req,res,next) => deleteOneLodge(req,res,next)
export const NewLodge: RequestHandler = (req,res,next) => newLodge(req,res,next)
export const AllLodgeByOneUser: RequestHandler = (req,res,next) => allLodgeByOneUser(req,res,next)
export const GetAllLodges: RequestHandler = (req,res,next) => getAllLodge(req,res,next)