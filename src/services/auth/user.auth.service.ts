import { IUser } from "../../interface/user.interface";
import { UserModel } from "../../model/user.model";
import { HttpCode } from "../../utils/AppError";
import { AsyncHandler } from "../../utils/AsyncHandler";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "./token.service";
import otpGenerator from "otp-generator";
import { otpModel } from "../../model/otp.model";
import { sendOTP } from "../../config/sendMail";

// generate otp

const generateAndSaveOTP = async (email: string) => {
  const generateOtp = await otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    digits: true,
    lowerCaseAlphabets: false,
  });

  const otp = new otpModel({
    otp: generateOtp,
    email: email,
  });

  const genSalt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, genSalt);

  await otp.save();
  return generateOtp;
};

// register a new user
export const registerUser = AsyncHandler(
  async (req: Request<{}, {}, IUser>, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, phoneNumber, userType } = req.body;

    // Validate required fields

    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }

    // check if email already exists
    const checkIfMailExists = await UserModel.findOne({ email });

    if (checkIfMailExists) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: "User already exists with this email" });
    }

    // bcrypt the password
    const genSaltPassword = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, genSaltPassword);

    // Create a new user
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      phoneNumber,
      userType
    });

    // generate otp and save to database

    const generateOtp = await generateAndSaveOTP(email);

    console.log("Generated OTP:", generateOtp);

    // send otp to user email
    await sendOTP(email, generateOtp);

    // remove password from the response
    const { password: any, ...doc } = user?.toObject();

   

    return res.status(HttpCode.OK).json({
      message: "User registered successfully. Please verify your email",
      data: doc,
    });
  }
);

// login user
export const loginUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const findUser = await UserModel.findOne({ email: email });

    if (!findUser) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: "Email or password is incorrect" });
    }

    const comparePassword = await bcrypt.compare(
      password,
      findUser?.password as string
    );

    if (!comparePassword) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: "Email or password is incorrect" });
    }

    if (findUser?.isEmailVerified === false) {
      const generateOtp = await generateAndSaveOTP(email);

          console.log("Generated OTP:", generateOtp);


      await sendOTP(email, generateOtp);

      return res
        .status(HttpCode.OK)
        .json({
          message: "OTP sent to your mail. Verify mail before logging in",
          data: findUser
        });
    }

    const { password: _removedPassword, ...doc } = findUser?.toObject();
    const accessToken = createAccessToken(doc);

    const refreshToken = createRefreshToken(doc);

    const token = {accessToken, refreshToken};

    findUser.token = token

    await findUser.save();

    return res.status(HttpCode.OK).json({
      message: "User logged in successfully",
      data: doc,
    });
  }
);

// verify user email
export const verifyEmail = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    const findOtp = await otpModel.find({ email: email });

    if (findOtp.length === 0 || !findOtp) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: "No OTP found for this email" });
    }

    const rightOtp = findOtp[findOtp.length - 1];

    const compareOtp = await bcrypt.compare(otp, rightOtp.otp as string);

    if (!compareOtp) {
      return res.status(HttpCode.BAD_REQUEST).json({ message: "Invalid OTP" });
    }

    const updateUser = await UserModel.findOneAndUpdate(
      { email: email },
      { isEmailVerified: true },
      { new: true }
    );

    await otpModel.deleteMany({ email });


    if (updateUser) {
      const { password: any, ...doc } = updateUser;

      // create access token
      const accessToken = createAccessToken(doc);
      const refreshToken = createRefreshToken(doc);

      const token = { accessToken, refreshToken };

      updateUser.token = token
      await updateUser.save();

      return res
        .status(HttpCode.OK)
        .json({
          message: "Email verified successfully and User Logged in",
          data: updateUser,
        });
    } else {
      console.log("update user doesn't exist");
      res.status(HttpCode.BAD_REQUEST).json({ message: "User not found" });
    }
  }
);

// resend otp
export const resendOtp = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const findUser = await UserModel.findOne({ email: email });

    if (!findUser) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: "User not found" });
    }

    const generateOtp = await generateAndSaveOTP(email);

    await sendOTP(email, generateOtp);

    console.log("Generated OTP:", generateOtp);

    res.status(HttpCode.OK).json({ message: "OTP sent successfully" });
  }
);


// forget password
export const forgetPassword = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const findUser = await UserModel.findOne({ email: email });

    if (!findUser) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: "User not found" });
    }

    const generateOtp = await generateAndSaveOTP(email);

    await sendOTP(email, generateOtp);

    res.status(HttpCode.OK).json({ message: "OTP sent successfully" });
  }
);

// change password

export const changePassword = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, otp, password } = req.body;

  const findUser = await UserModel.findOne({ email: email });

  if (!findUser) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: "User not found" });
  }

   const findOtp = await otpModel.find({ email: email });

    if (findOtp.length === 0 || !findOtp) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: "No OTP found for this email" });
    }

    const rightOtp = findOtp[findOtp.length - 1];

    const compareOtp = await bcrypt.compare(otp, rightOtp.otp as string);

  if (!compareOtp) {
    return res.status(HttpCode.BAD_REQUEST).json({ message: "Invalid OTP" });
  }

  const hashNewPassword = await bcrypt.hash(password, 10);

  findUser.password = hashNewPassword;
  await findUser.save();

  res.status(HttpCode.OK).json({ message: "Password changed successfully" });
});