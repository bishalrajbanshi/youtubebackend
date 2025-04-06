import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import db from "../models/index.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { extractPublicId } from "cloudinary-build-url";
import bcryptjs from "bcryptjs";
import * as EmailValidator from "email-validator";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/generatetoknes.js";
import { decode } from "jsonwebtoken";
import {userPayload} from "../utils/excludesData.js";

class user_controller {
  /**
   * register user
   */
  static userRegister = asyncHandler(async (req, res, next) => {
    try {
      const { username, channel, email, password } = req.body;

      // Manual validation
      if (!username || !channel || !email || !password) {
        throw new apiError({
          statusCode: 400,
          message: "VALIDATION FAILED",
          errors: [
            ...(!username
              ? [{ field: "user_name", message: "USERNAME IS REQUIRED" }]
              : []),
            ...(!channel
              ? [{ field: "full_name", message: "FULL NAME IS REQUIRED" }]
              : []),
            ...(!email
              ? [{ field: "email", message: "EMAIL IS REQUIRED" }]
              : []),
            ...(!password
              ? []
              : [{ field: "password", message: "PASSWORD IS REQUIRED" }]),
          ],
        });
      }

      //calidat email
      const validEmail = EmailValidator.validate(email);
      if (!validEmail) {
        throw new apiError({
          statusCode: 402,
          message: "VALIDATION FAILED EMAIL",
        });
      }

      // Check existing user
      const existingUser = await db.user.findOne({ where: { email: email } });
      if (existingUser) {
        throw new apiError({
          statusCode: 409,
          message: "EMAIL ALREADY REGISTERED",
          errors: [{ field: "email" }],
        });
      }
      //get the first property of avatar
      const avatarLocalPath = req.files?.avatar?.[0]?.path;
      const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

      console.log("avatarLocalPath", avatarLocalPath);

      //check fro avatar
      if (!avatarLocalPath) {
        throw new apiError({
          statusCode: 400,
          message: "avatar is required",
        });
      }

      //now upload to cloudinary
      const avatar = await uploadOnCloudinary(avatarLocalPath);
      const coverImage = await uploadOnCloudinary(coverImageLocalPath);

      console.log("avatar", avatar);
      console.log("coverImage", coverImage);
      if (!avatar) {
        throw new apiError({
          statusCode: 400,
          message: "avatar not found",
        });
      }

      //hash
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(password, salt);
      console.log("hashed pwd", hash);

      // Create user
      await db.user.create({
        userName: username,
        channelName: channel,
        email: email,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password: hash,
      });

      return res.status(201).json(
        new apiResponse({
          statusCode: 201,
          message: "USER REGISTERED SUCCESSFULLY",
          success: true,
        }),
      );
    } catch (error) {
      return next(error);
    }
  });

  /**
   * user login
   */
  static userLogin = asyncHandler(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new apiError({
          statusCode: 400,
          message: "email and password required",
        });
      }

      //check for existing user
      const existUser = await db.user.findOne({ where: { email } });

      if (!existUser) {
        throw new apiError({
          statusCode: 400,
          message: "user not exist",
        });
      }

      //validate password
      const isValidPassword = await bcryptjs.compare(
        password,
        existUser.password,
      );
      console.log("isValidPassword", isValidPassword);
      console.log("existUser", existUser.email);

      if (!isValidPassword) {
        throw new apiError({
          statusCode: 400,
          message: "incorrect credentials",
        });
      }

      //generate toknes
      const accessToken = await generateAccessToken(existUser);
      const refreshToken = await generateRefreshToken(existUser);
      console.log("access", accessToken);
      console.log("refresh", refreshToken);
      await db.user.update(
        {
          refreshToken: refreshToken,
          isLoggedIn: true,
          updatedAt: new Date()
        },
        {
          where: { userId: existUser.userId },
        },
      );

      const isLoggedInUser = await db.user.findOne({
        where: { userId: existUser.userId },
        include: [
          {
            model: db.subscription,
            as: "subscribers",
            attributes: ["subscriber", "channel"],
          },
        ],
        attributes: {
          exclude: ["password", "refreshToken", "createdAt", "updatedAt"],
        },
      });

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, { ...options, path: "/" })
        .cookie("refreshToken", refreshToken, {
          ...options,
          path: "/auth/refresh",
        })
        .json(
          new apiResponse({
            success: true,
            message: "login success",
            data: isLoggedInUser,
          }),
        );
    } catch (error) {
      console.log("error in login", error);
      return next(error);
    }
  });

  /**
   * user loggout controller
   */

  static userLogout = asyncHandler(async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      //validate
      if (!userId) {
        throw new apiError({
          statusCode: 401,
          message: "invalid userId",
        });
      }
      const existUser = await db.user.findByPk(userId);
      if (!existUser) {
        throw new apiError({
          ststusCode: 404,
          message: "access denied",
        });
      }

      db.user.update(
        {
          refreshToken: null,
          isLoggedIn: false,
        },
        {
          where: { userId: existUser.userId },
        },
      );

      const options = {
        httpOnly: true,
        secure: true,
      };
      return res
        .status(200)
        .clearCookie("accessToken", { ...options, path: "/" })
        .clearCookie("refreshToken", { ...options, path: "/auth/refresh" })
        .json(
          new apiResponse({
            success: true,
            message: "loggout success",
          }),
        );
    } catch (error) {
      return next(error);
    }
  });

  /**
   * edit users details
   */

  static editDetails = asyncHandler(async (req, res, next) => {
    const userId = req.user?.userId;
    const { username, channel, email } = req.body;
    console.log("userId", userId);

    if (!userId) {
      throw new apiError({
        statusCode: 403,
        message: "unauthorized user",
      });
    }
    try {
      //find the user
      const existUser = await db.user.findByPk(userId);
        if (!existUser) {
            throw new apiError({
                statusCode: 401,
                message: "invalid user",
            });
        }
      const avatarImageLink = existUser?.avatar;
      const coverImageLink = existUser?.coverImage;
      //avatar and cover image request
      const avatarLink = req.files?.avatar?.[0].path;
      const coverLink = req.files?.coverImage?.[0].path;
      if (avatarLink && coverLink) {
        imageAvatar(avatarImageLink)
        imageCover(coverImageLink);
      } else if(coverLink) {
        imageCover(coverImageLink);
      }else  {
        imageAvatar(avatarLink);
      }

      //upload to cloudinary
      const profile =  uploadOnCloudinary(avatarLink);
      const cover = uploadOnCloudinary(coverLink);

        //update in database
     await db.user.update({
        userName: username || existUser.userName,
        channelName: channel || existUser.channelName,
        email: email || existUser.email,
        avatar: profile?.url || existUser.avatar,
        coverImage: cover?.url || existUser.coverImage
    },
{
    where: {userId:userId}
})

      res.status(200).json(
        new apiResponse({
          success: true,
          message: "user updated",
        }),
      );
    } catch (error) {
      return next(error);
    }
  });

  /**
   * change password
   */

  static changePassword = asyncHandler(async (req, res, next) => {
    const userId = req.user?.userId;
    const { oldPassword,newPassword } = req.body;
    console.log(oldPassword);
    console.log(newPassword);
    if (!userId) {
      throw new apiError({
        statusCode: 403,
        message: "invalid userId",
      })
    }
    try {
      const existUser = await db.user.findOne({
        where: { userId: userId },
        attributes: ["password"],
      });

      console.log("existing user password", existUser?.password);

      if (!existUser || !existUser.password) {
        throw new apiError({
          statusCode: 403,
          message: "Invalid user or password not found",
        });
      }

      // Ensure that oldPassword is a valid string before calling bcryptjs.compare
      const isValidPassword = await bcryptjs.compare(oldPassword, existUser.password);
      console.log("Is password valid?", isValidPassword);
      if (!isValidPassword) {
        throw new apiError({
          statusCode: 403,
          message: "invalid password",
        })
      }
      //set new password
      const salt = await bcryptjs.genSalt(10);
      const hashed = await bcryptjs.hash(newPassword, salt);
      console.log("password", hashed);
      //update to database
      await db.user.update(
          { password: hashed, isLoggedIn: false, refreshToken: null },
          {where: { userId: userId },}
      )
      res.status(200)
          .json(new apiResponse({
            success: true,
            message: "user updated successfully",
          }))
    } catch (error) {
      console.log("Error:", error);
      return next(error);
    }

  })

}
export default user_controller;

//validate avatar link and cover image link
 function imageCover(coverImageLink) {
   const publicIdCover = extractPublicId(coverImageLink);
    const deleteImage =  deleteFromCloudinary(publicIdCover);
    console.log("delete image response", deleteImage);
}
function imageAvatar(avatarImageLink) {
  const publicIdAvatar = extractPublicId(avatarImageLink);
  const deleteAvatar = deleteFromCloudinary(publicIdAvatar);
  console.log("delete avatar response", deleteAvatar);
}

