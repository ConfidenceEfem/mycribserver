import userRouter from "../router/user.router";
import listingRouter from "../router/listing.router";
import userAuthRouter from "../router/user.auth.route";
import { Router } from "express";

const router = Router()

router.use("/auth", userAuthRouter)
router.use("/listing", listingRouter)
router.use("/user", userRouter)

export default router