import mongoose from "mongoose";
import { IListings } from "src/interface/listing.interface";

const ListingSchema = new mongoose.Schema<IListings>({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    typeOfLodge: {
        type: String,
        required: true
    },
    withRoomate: {
        type: Boolean,
        default: false,
    },
    numberOfRoomates: {
        type: Number,
        required: true,
    },

    agentId: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    }
}, {
    timestamps: true
})

export const ListingModel  = mongoose.model("listing", ListingSchema)

