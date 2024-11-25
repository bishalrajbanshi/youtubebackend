import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

// user regirestation
const registerUser = asyncHandler(async (req, res) => {
  //get user detials
  const { fullName, username, email, password } = req.body;
  console.log(username, email);
  console.log(req.body);

  //check if user empty ( validatation )
  if (fullName === "") {
    throw new apiError(400, "fullname is required");
  }
  if (username === "") {
    throw new apiError(400, "username is required");
  }
  if (email === "") {
    throw new apiError(400, "email is required");
  }
  if (password === "") {
    throw new apiError(400, "password is required");
  }

  //check already exist
  const existingUser =await User.findOne({
    //using operator
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new apiError(409, "user already exit");
  }

  //check for images,avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalpath = req.files?.coverimage[0]?.path;
  console.log('Files:', req.files);

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar field is required");
  }

  //upload to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalpath);

  if (!avatar) {
    throw new apiError(400, "Avatar field is required");
  }

  //create user ojects -  create entry in db
  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
  });

  //check for user creation
  const createdUser = await User.findById(user._id).select(
    //remove password and refreshtoken field from response
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new apiError(500, "error while registering user");
  }

  //return response
  return res.status(201).json(
    new apiResponse(200,createdUser,"user registered successfully")
  )

});

export { registerUser };
