import { Document } from "mongoose";

export interface IUser extends Document{
    firstName: string,
    lastName: string,
    avatarUrl: string,
    email: string,
    password: string,
    token: Object,
    phoneNumber: string,
    userType: string,
    isEmailVerified: boolean,
    
}