import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import db from "../models/index.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import bcryptjs, { genSalt } from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../middlewares/generatetoknes.js";
import { where } from "sequelize";
import { log } from "console";
import path from "path";

class user_controller {
    /**
     * register user 
     */
  static user_register = asyncHandler(async(req, res, next) => {
        try {
            const { username, fullname, email, password } = req.body;
           
            // Manual validation
            if (!username || !fullname || !email || !password) {
                throw new apiError({
                    statusCode: 400,
                    message: "VALIDATION FAILED",
                    errors: [
                      ...(!username ? [{ field: "user_name", message: "USERNAME IS REQUIRED" }] : []),
                      ...(!fullname ? [{ field: "full_name", message: "FULL NAME IS REQUIRED" }] : []),
                      ...(!email ? [{ field: "email", message: "EMAIL IS REQUIRED" }] : []),
                      ...(!password ?  []:[{ field: "password", message: "PASSWORD IS REQUIRED" }] )
                    ]
                });
            }
    
            // Check existing user
            const existingUser = await db.user.findOne({ where: { email } });
            if (existingUser) {
                throw new apiError({
                    statusCode: 409,
                    message: "EMAIL ALREADY REGISTERED",
                    errors: [{ field: "email"}]
                });
            };
            //get the first property of avatar
            const avatarLocalPath = req.files?.avatar?.[0]?.path;
            const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

            console.log("avatarLocalPath",avatarLocalPath);
            
            //check fro avatar
            if (!avatarLocalPath) {
                throw new apiError({
                    statusCode:400,
                    message:"avatar is required"
                })
            };

            //now upload to cloudinary
          const avatar = await uploadOnCloudinary(avatarLocalPath);
          const coverImage = await uploadOnCloudinary(coverImageLocalPath);
          if (!avatar) {
            throw new apiError({
                statusCode: 400,
                message:"avatar not found"
            })
          };

          //hash the passowrd
          const salt = await bcryptjs.genSalt(10);
          const hashpwd = (await bcryptjs.hash(password,salt))
          console.log("hashed pwd",hashpwd);
          
            // Create user
            const newUser = await db.user.create({
                userName: username,
                fullName: fullname,
                email: email,
                avatar: avatar.url,
                coverImage: coverImage?.url || "",
                password: hashpwd 
            });
    
            return res.status(201).json(
                new apiResponse({
                    statusCode: 201,
                    message: "USER REGISTERED SUCCESSFULLY",
                    success: true
                })
            );
    
        } catch (error) {
            return next(error);
        }
    });


/**
 * user login
 */
static user_login = asyncHandler(async(req,res,next)=>{
        try {
            const { email, password } = req.body;
                if (!email || !password) {
                    throw new apiError({
                        statusCode: 400,
                        message:"email and password required"
                    })
                };
            
                //check for existing user
                const existUser = await db.user.findOne({ where: {email}});
              
                if (!existUser) {
                    throw new apiError({
                        statusCode:400,
                        message: "user not exist"
                    })
                };

                //validate password
                const isValidPassword = await bcryptjs.compare(password,existUser.password);
                console.log("isValidPassword",isValidPassword);
                console.log("existUser",existUser.email);

                
                if (!isValidPassword) {
                    throw new apiError({
                        statusCode: 400,
                        message: "incorrect credentials"
                    })
                }

                //generate toknes
                const accessToken = await generateAccessToken(existUser);
                const refreshToken  = await generateRefreshToken(existUser);
                console.log("access",accessToken);
                console.log("refresh",refreshToken);
                await db.user.update(
                    {
                        refreshToken:refreshToken,
                        isLoggedIn: true
                    },
                    {
                        where: { userId: existUser.userId }
                    }
                )

                const isLoggedInUser = await db.user.findOne({
                    where: {userId: existUser.userId},
                    attributes: { exclude: ["password", "refreshToken","createdAt","updatedAt"]}
                });

                const options = {
                    httpOnly: true,
                    secure: true
                };

                return res
                .status(200)
                .cookie("accessToken",accessToken,{...options,path:"/"})
                .cookie("refreshToken",refreshToken,{...options,path:"/auth/refresh"})
                .json(new apiResponse({
                    success:true,
                    message:"login success",
                    data:isLoggedInUser
                }));

        } catch (error) {
            console.log("error in login",error);
            return next(error)
            
        }
});

/**
 * user loggout controller
 */

static user_logout = asyncHandler(async(req,res,next) => {
    try {
        const userId = req.user?.userId
        //validate 
        if (!userId) {
            throw new apiError({
                statusCode: 401,
                message: "invalid userId"
            })
        };
        const existUser = await db.user.findByPk(userId);
        if (!existUser) {
            throw new apiError({
                ststusCode: 404,
                message: "access denied"
            })
        };

        db.user.update(
            {
                refreshToken: null,
                isLoggedIn:false
            },
            {
                where: {userId:existUser.userId}
            }
        );

        const options= {
            httpOnly: true,
            secure: true
        }
        return res.status(200)
        .clearCookie("accessToken", { ...options, path: "/" })
        .clearCookie("refreshToken", { ...options, path: "/auth/refresh" })
        .json( new apiResponse({
            success: true,
            message:"loggout success"
        }))


    } catch (error) {
        return next(error)
    }
})

}
export default user_controller;