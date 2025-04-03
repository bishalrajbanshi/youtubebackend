import { asyncHandler } from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import db from "../models/index.js";


const getUsers = asyncHandler(async(req,res,next) => {
    try {
        const userId = req.user?.userId;
const videos = await db.video.findAll({
    where: { userId }, 
    include: {
        model: db.user,
    }
});

return res.status(200).json(new apiResponse({
    statusCode: 200,
    success: true,
    data: videos,
    message: "User's videos list"
}));

    } catch (error) {
        return next(error);
    }
})

export default getUsers;