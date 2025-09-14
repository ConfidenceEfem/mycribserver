import express, { Application } from "express";
import http from "http"
// import { initSocket } from "./socket";
const app : Application = express()

// const createServer = http.createServer(app)

// export const io = initSocket(createServer)

import { appConfig } from "./server";
import { connectDB } from "./config/db";
import { EnvironmentalVariables } from "./config/environmentalVariables";



appConfig(app)
connectDB() 
app.listen(EnvironmentalVariables.PORT as number, () => {
    console.log("listening to port", EnvironmentalVariables.PORT)
})

