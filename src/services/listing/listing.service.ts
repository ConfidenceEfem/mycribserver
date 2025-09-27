import { NextFunction, Request, Response } from "express";
import cloudinary from "../../config/cloudinary";
import { IListings } from "../../interface/listing.interface";
import { ListingModel } from "../../model/listing.model";
import { UserModel } from "../../model/user.model";
import { HttpCode } from "../../utils/AppError";
import { AsyncHandler } from "../../utils/AsyncHandler";

// delete lodge
export const deleteOneLodge = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    const lodgeId = req.params.id;

    if (!lodgeId) {
      return res.status(HttpCode.BAD_REQUEST).json({
        message: "No Lodge ID inputed",
      });
    }

    const findLodge = await ListingModel?.findById(lodgeId);

    if (userId !== findLodge?.agentId) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        message: "You don't have right for this operation",
      });
    }

    await ListingModel?.findByIdAndDelete(req.params.id);

    res.status(HttpCode?.OK).json({
      message: "Lodge deleted",
    });
  }
);

// create new lodge
export const newLodge = AsyncHandler(
  async (
    req: Request<{}, {}, IListings>,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req?.user?._id;
    const {
      title,
      description,
      price,
      withRoomate,
      numberOfRoomates,
      typeOfLodge,
      location,
      qualities,
      numberOfLove,
      numberOfBookmark,
      isSold,
    } = req.body;
    const findUser = await UserModel.findById(userId);

    const files = req.files as Express.Multer.File[];

    if (findUser?.userType === "agent") {
      return res.status(HttpCode.BAD_REQUEST).json({
        message: "You are not authorized for this operation",
      });
    }

    if (!files || files.length === 0) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: "No files uploaded" });
    }

    const uploadPromises = files.map(async (file) => {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;

      return await cloudinary.uploader.upload(dataURI, {
        folder: "mycrib avatars",
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    const urls = uploadResults.map((r) => r.secure_url);

    const lodge = new ListingModel({
      title,
      description,
      price,
      withRoomate,
      numberOfRoomates,
      typeOfLodge,
      location,
      qualities,
      isSold,
      myImages: urls,
    });

    lodge.agentId = findUser?._id;

    await lodge.save();

    res.status(HttpCode.CREATED).json({
      message: "Lodge created successfully",
      data: lodge,
    });
  }
);

export const allLodgeByOneUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const allLodge = await ListingModel.find({ agentId: req?.user?._id }).populate("agentId", "-password -token -__v -createdAt -updatedAt -isEmailVerified -userType -bio -whatsappLink");
    res.status(HttpCode.OK).json({
      message: `All Lodges`,
      data: allLodge,
    });
  }
);

//all lodges on the app
export const getAllLodge = AsyncHandler(async (req: Request,res: Response,next:NextFunction) => {
  const allLodge = await ListingModel.find()
  res.status(HttpCode.OK).json({
    message: "All Lodges",
    data: allLodge
  })
})
