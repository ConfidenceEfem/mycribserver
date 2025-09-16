import { verifyAcessToken } from "../services/auth/token.service";

import { Router } from "express";
import { UploadAvatar } from "src/controller/user/user.controller";
import { uploader } from "src/middleware/uploader";

const userRouter = Router();

userRouter.post("/upload-avatar",verifyAcessToken,uploader, UploadAvatar);

export default userRouter;
