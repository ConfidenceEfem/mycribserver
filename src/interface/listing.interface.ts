import { Document } from "mongoose";

export interface IListings extends Document{
    title: string,
    price: number,
    image: Array<any>,
    description: string,
    typeOfLodge: string,
    location: string,
        qualities: Array<any>,
    withRoomate: boolean,
    isSold: boolean,
    numberOfRoomates: number,
    numberOfLove: number,
    numberOfBookmark: number,
    agentId: any
 
    
}