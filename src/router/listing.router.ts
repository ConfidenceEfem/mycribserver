import { verifyAcessToken, verifyRefreshToken } from "../services/auth/token.service";

import { Router } from "express";
import { AllLodgeByOneUser, DeleteOneLodge, GetAllLodges, NewLodge } from "../controller/listing.controller";
import {uploader} from "../middleware/uploader"

const listingRouter = Router();

listingRouter.delete("/:id",verifyAcessToken, DeleteOneLodge);
listingRouter.post("/new",uploader.array("images"), verifyAcessToken, NewLodge);
listingRouter.get("/user-lodges",verifyAcessToken, AllLodgeByOneUser);
listingRouter.get("/", GetAllLodges);

export default listingRouter;

// Removed invalid usage of upload.array("images")


