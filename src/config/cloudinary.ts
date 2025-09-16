import {v2 as cloudinary} from "cloudinary"
import { EnvironmentalVariables } from "./environmentalVariables"

cloudinary.config({
    cloud_name: EnvironmentalVariables.CLOUDINARY_CLOUD_NAME,
    api_key: EnvironmentalVariables.CLOUDINARY_API_KEY,
    api_secret: EnvironmentalVariables.CLOUDINARY_API_SECRET
})

export default cloudinary
