import { Document } from "mongoose";

export interface IListings extends Document{
    title: string,
    price: number,
    image: Array<any>,
    description: string,
    typeOfLodge: string,
    withRoomate: boolean,
    numberOfRoomates: number,
    agentId: any
 
    
}