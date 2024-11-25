 import { v2 as cloudinary } from "cloudinary";
 import fs from "fs";
//  import { configDotenv } from "dotenv";
//  configDotenv()
 
 
 // Configuration
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//uploding to cloudinary
const uploadOnCloudinary = async (localFilePath) => {

    try {
        if(!localFilePath) return null;
        //upload the file on cloudinary

     const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        //success upload 
        console.log("FILE UPLOADED ON CLOUDINARY",response.url);
        return response;
        
    } catch (error) {
        //remove the locally saved temp file as the upload operation got failed
        fs.unlinkSync(localFilePath)
        return null;
    }
} 

export { uploadOnCloudinary }