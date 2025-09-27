import mongoose, { Schema } from "mongoose"
import { IUser } from "../interface/user.interface";

const UserSchema = new mongoose.Schema<IUser>({
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String,trim: true, required: true },
    phoneNumber: { type: String, trim: true,required: true },
    avatarUrl: { type: String, default: ""},
    bio: { type: String, default: ""},
    whatsappLink: { type: String, default: ""},
    token: { type: Object, default: "" },
    location: {type: String, default: ""},
    userType: { type: String, trim: true, default: "student" },
    isEmailVerified: { type: Boolean, trim: true,default: false },
    isVerifiedAgent: {type: Boolean, default: false},
}, {
    timestamps: true,
})

export const UserModel = mongoose.model("user", UserSchema)