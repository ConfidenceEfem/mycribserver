import { verifyRefreshToken } from "../services/auth/token.service";
import {
  ChangePassword,
  ForgetPassword,
  LoginAUser,
  RegisterANewUser,
  ResendUserOTP,
  updateRefreshToken,
  VerifyUserEmail,
} from "../controller/auth/user.auth.controller";
import { Router } from "express";

const userAuthRouter = Router();

userAuthRouter.post("/signup", RegisterANewUser);
userAuthRouter.post("/login", LoginAUser);
userAuthRouter.post("/resend-otp", ResendUserOTP);
userAuthRouter.post("/verify-account", VerifyUserEmail);
userAuthRouter.post("/refresh-token", verifyRefreshToken, updateRefreshToken);
userAuthRouter.post("/forget-password", ForgetPassword);
userAuthRouter.post("/change-password", ChangePassword);

export default userAuthRouter;
