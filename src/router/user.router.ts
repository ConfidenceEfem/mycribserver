import { verifyAcessToken } from "../services/auth/token.service";

import { Router } from "express";
import { AllAgents, CurrentUserData, GetOneUser, ResetPassword, UpdateUserProfile, UploadAvatar } from "../controller/user/user.controller";
import { uploader } from "../middleware/uploader";

const userRouter = Router();

userRouter.post("/upload-avatar",verifyAcessToken,uploader.single("image"), UploadAvatar);
userRouter.post("/update-user",verifyAcessToken,  UpdateUserProfile);
userRouter.get("/", verifyAcessToken, CurrentUserData);
userRouter.get("/reset-password", verifyAcessToken, ResetPassword);
userRouter.get("/:id", GetOneUser);
userRouter.get("/agents", AllAgents);

export default userRouter;
