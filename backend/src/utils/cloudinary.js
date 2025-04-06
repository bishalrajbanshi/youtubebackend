import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } from "../constant.js";

//step1 configure cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

async function uploadOnCloudinary(localFilePath) {
  try {
    if (!localFilePath) {
      return null;
    }

    // upload to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "/youtube-backend",
    });
    console.log(response);

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log("uploading error", error);
    return error;
  }
}

async function deleteFromCloudinary(publicId,resourceType) {
    
  try {
      if (!publicId) {
          return null;
      }
      const response = await cloudinary.uploader.destroy(publicId,{
          resource_type: resourceType,
      })
      console.log("delete response",response);
      return response;
  }catch (error) {
      console.log(error);
      return error;
  }
}

export { uploadOnCloudinary , deleteFromCloudinary};
