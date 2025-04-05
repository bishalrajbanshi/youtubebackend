import { asyncHandler } from "../utils/asyncHandler.js";   
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { ACCESSTOKENSECRET } from "../constant.js";
import jwt from "jsonwebtoken";

const verifyJwt = asyncHandler(async(req,_,next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");

    //validate token 
    if (!token) {
        throw new apiError({
            statusCode: 400,
            message: "access denied"
        })
    }


    try {
        //verify the token 
        const decoded = jwt.verify(token,ACCESSTOKENSECRET);
        req.user= decoded;
        console.log("decoded",decoded.email);
        next();
    } catch (error) {
        console.error("JWT Verification error:", error);

        if (error.name === "TokenExpiredError") {
            return next(new apiError({
              statusCode: 401,
              message: "TokenExpired",
            }));
          }

        return next(new apiError({
            statusCode: 401,
            message: "Invalid or expired token"
        }));
    }
})

export default verifyJwt;