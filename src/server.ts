import express, { Application, Request, Response } from "express"
import cors from "cors"
import { ErrorHandler } from "./middleware/error/index"
import router from "./api"
export const appConfig = (app: Application) => {
    app.use(express.json()).use(cors()).get("/", (req: Request, res: Response)=> {
        res.send("Welcome to my Application")

    })
    .use("/api", router)

    // app.use(ErrorHandler)
}
