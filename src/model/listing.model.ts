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
    isSold: {
        type: Boolean,
        default: false,
    },
    numberOfRoomates: {
        type: Number,
        // required: true,
        default: 0,
    },
    location: {
        type: String,
        required: true
    },
    qualities: {
        type: [],
    },
    numberOfLove:{
        type: Number,
        default: 0
    },
    numberOfBookmark:{
        type: Number,
        default: 0
    },
    myImages: {
        type: [String],
        default: []
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, {
    timestamps: true
})

export const ListingModel  = mongoose.model("listing", ListingSchema)

