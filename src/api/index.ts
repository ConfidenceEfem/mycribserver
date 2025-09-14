// import userTaskRouter from "../router/user.task.route";
import userAuthRouter from "../router/user.auth.route";
import { Router } from "express";
// import UserRouter from "../router/user.route";

const router = Router()

router.use("/auth", userAuthRouter)
// router.use("/user", UserRouter)
// router.use("/task", userTaskRouter)

export default router