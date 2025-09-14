import mongoose from "mongoose"
import { EnvironmentalVariables } from "./environmentalVariables"

export const connectDB = () => {
 mongoose.connect(EnvironmentalVariables.DB_URI as string).then((db)=>{
    console.log("Connected to Database at", db.connection.host)
 }).catch((err)=>{
    console.log("Failed connecting to database", err)
 })
}