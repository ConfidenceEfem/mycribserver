import { NextFunction, Request, Response } from "express";
import { IListings } from "src/interface/listing.interface";
import { ListingModel } from "src/model/listing.model";
import { UserModel } from "src/model/user.model";
import { HttpCode } from "src/utils/AppError";
import { AsyncHandler } from "src/utils/AsyncHandler";

export const createLodge = AsyncHandler(
  async (
    req: Request<{}, {}, IListings>,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req?.user?._id;

    const findUser = await UserModel.findById(req?.user?._id);

    if (findUser?.userType !== "agent") {
      return res.status(HttpCode.BAD_REQUEST).json({
        message: "You are not authorized for this operation",
      });
    }

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

    if (title || description || price) {
      const newLodge = new ListingModel({
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
      });

      newLodge.agentId = findUser?._id;

      newLodge.save();

      res.status(HttpCode.CREATED).json({
        message: "Lodge created successfully",
        data: newLodge,
      });
    } else {
      res.status(HttpCode.BAD_REQUEST).json({
        message: "Input are missing",
      });
    }
  }
);

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
