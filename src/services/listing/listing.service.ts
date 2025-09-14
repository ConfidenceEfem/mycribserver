import { NextFunction, Request, Response } from "express";
import { IListings } from "src/interface/listing.interface";
import { HttpCode } from "src/utils/AppError";
import { AsyncHandler } from "src/utils/AsyncHandler";

export const createLodge = AsyncHandler(async (req: Request<{}, {}, IListings>,res: Response,next: NextFunction) => {

    const {title, description, price, withRoomate, numberOfRoomates, typeOfLodge, } = req.body

    if( title || description || price ){

    }else{
        res.status(HttpCode.BAD_REQUEST).json({
            message: "Input are missing"
        })
    }

})