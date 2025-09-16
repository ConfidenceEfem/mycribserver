import { NextFunction, Request, Response } from "express";
import { UserModel } from "src/model/user.model";
import { HttpCode } from "src/utils/AppError";
import { AsyncHandler } from "src/utils/AsyncHandler";
import cloudinary from "../../config/cloudinary";

export const updateUserProfile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    const { whatsappLink } = req.body;

    const findUserAndUpdate = await UserModel?.findByIdAndUpdate(
      userId,
      {
        whatsappLink,
      },
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

      const user = await UserModel.findByIdAndUpdate(
        req.user?._id,
        { avatarUrl: result.secure_url },
        { new: true }
      );
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

//d
