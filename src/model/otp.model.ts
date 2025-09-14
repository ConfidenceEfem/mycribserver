import { Iotp } from "../interface/otp.interface";
import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema<Iotp>({
    email: { type: String, required: true, trim: true },
    otp: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now, index:{expires: 300} }
})

export const otpModel = mongoose.model("otp", OtpSchema)