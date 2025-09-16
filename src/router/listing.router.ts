import { verifyAcessToken, verifyRefreshToken } from "../services/auth/token.service";

import { Router } from "express";
import { DeleteOneLodge, RegisterLodge } from "src/controller/listing.controller";

const listingRouter = Router();

listingRouter.post("/create",verifyAcessToken, RegisterLodge);
listingRouter.delete("/:id",verifyAcessToken, DeleteOneLodge);

export default listingRouter;
