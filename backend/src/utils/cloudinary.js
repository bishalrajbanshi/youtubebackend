import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } from "../constant.js";

//step1 configure cloudinary
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET
});

async function uploadOnCloudinary(localFilePath) {
    try {
        if (!localFilePath) {
            return null;
        }

        // upload to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto",
            folder: "/youtube-backend"
        });
        console.log(response);
        
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
            fs.unlinkSync(localFilePath);
        console.log("uploading error",error);
          return next(error);
          
    }
};

export default uploadOnCloudinary;