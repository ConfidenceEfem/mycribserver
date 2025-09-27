import { NextFunction, Request, Response } from "express";
import { UserModel } from "../../model/user.model";
import { HttpCode } from "../../utils/AppError";
import { AsyncHandler } from "../../utils/AsyncHandler";
import cloudinary from "../../config/cloudinary";
import bcrypt from "bcryptjs";

export const updateUserProfile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    const { whatsappLink } = req.body;

    console.log(req.body, "request for update user")

    const findUserAndUpdate = await UserModel?.findByIdAndUpdate(
      userId,
      req.body,
      { new: true }
    );

    res.status(HttpCode.ACCEPTED).json({
      messsage: "user updated successfully",
      data: findUserAndUpdate,
    });
  }
);

// upload user avatar
export const uploadAvatar = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;

    console.log(req.user, "this is user from upload avatar")

    if (!file) {
      return res.status(HttpCode.BAD_REQUEST).json({
        message: "No file uploaded",
      });
    }

    try {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "mycrib avatars",
      });

      console.log(req.user?._id, "this is the user id")

      const user = await UserModel.findByIdAndUpdate(
        req.user?._id,
        { avatarUrl: result.secure_url },
        { new: true }
      );

      console.log(user, "this is the updated user")

      res.status(HttpCode.OK).json({
        message: "User avatar updated successfully",
        data: user,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log("this is the error from uploading image", error.message);
      } else {
        console.log("this is the error from uploading image", error);
      }

      res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        message: "Error uploading user avatar",
      });
    }
  }
);

//get current user
export const currentUserData = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userData = await UserModel?.findById(req?.user?._id);
    res.status(HttpCode.OK).json({
      message: "current user data",
      data: userData,
    });
  }
);

//reset password
export const resetPassword = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;

    if (currentPassword === "" || newPassword === "") {
      return res
        ?.status(HttpCode.BAD_REQUEST)
        .json({ message: "You haven't inputed any data" });
    }

    const findUser = await UserModel.findById(req?.user?._id);
    if (!findUser) {
      return res
        ?.status(HttpCode.NOT_FOUND)
        .json({ message: "You can't perform this operation" });
    }

    const comparePassword = await bcrypt.compare(
      currentPassword,
      findUser?.password
    );

    if (!comparePassword) {
      return res.status(HttpCode.BAD_REQUEST).json({
        message: "You password is incorrect",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(HttpCode.BAD_REQUEST).json({
        message: "New password must be different from old password",
      });
    }

    const genSalt = await bcrypt.genSalt(10);

    const newPasswordHash = await bcrypt.hash(newPassword, genSalt);

    await UserModel.findByIdAndUpdate(req?.user?._id, {
      password: newPasswordHash,
    });

    return res
      .status(HttpCode.OK)
      .json({ message: "Password reset successful" });
  }
);

// get one user
export const getOneUser = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if(!req.params.id){
    return res.status(HttpCode.BAD_REQUEST).json({
      message: "No user found",
    })
  }
  const oneUser = await UserModel.findById(req.params.id)

  await UserModel.find({userType: "agent"})

  if(!oneUser){
    return res.status(HttpCode.BAD_REQUEST).json({
      message: "This user not found"
    })
  }

  return res.status(HttpCode.OK).json({
    message: "User detail",
    data: oneUser
  })

})

//get all users with user type of agent
export const allAgents = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const agents = await UserModel.find({userType: "Agent"})
  if(!agents){
    return res.status(HttpCode.NO_CONTENT).json({
      message: "Not found"
    })
  }

  return res.status(HttpCode.OK).json({
    message: "All Agents",
    data: agents
  })
})