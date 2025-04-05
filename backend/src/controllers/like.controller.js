import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import db from "../models/index.js";

/**
 * like controllers
 */

class like_Controller {
  /**
   * video like
   */
  static videoLike = asyncHandler(async (req, res, next) => {
    const userId = req.user?.userId;
    const videoId = req.params.videoId;
    console.log("User ID:", userId);
    console.log("Video ID:", videoId);
    //validate for user and video ids
    check(userId);
    if (!videoId) {
      throw new apiError({
        statusCode: 403,
        message: "video id not found",
      });
    }
    try {
      //find video like
      const videoLike = await db.videolike.findOne({
        where: {likeBy: userId, videoId: videoId},
      });
      if (!videoLike) {
          //create the entry
          await db.videolike.create({
            likeBy: userId,
            videoId: videoId,
            where: {likeBy: userId, videoId: videoId},
          });
         res.status(200)
             .json( new apiResponse({
               success: true,
               message: 'Video Liked Successfully',
             }));
      }else {
        //remove the like
        await  db.videolike.destroy({
          where: {likeBy: userId, videoId: videoId},
        });
        res.status(200)
            .json( new apiResponse({
              success: true,
              message: 'Video UnLiked Successfully',
            }));
      }

      console.log("video like response model",videoLike)
    }catch (error) {
      return next(error);
    }

  });


  /**
   * comment like
   */

  static  commentLike = asyncHandler(async (req, res, next) => {
    const userId = req.user?.userId;
    const commentId = req.params.commentId;
    //validate user and commnentId
    check(userId);
    if (!commentId) {
      throw new apiError({
        statusCode: 403,
        message: "commentId not found",
      })
    }
    try {
      //find like comment
      const commentLiked = await db.commentlike.findOne({
        where: {likeBy: userId, commentId: commentId},
      });
      if (!commentLiked) {
        await db.commentlike.create({
          likeBy: userId,
          commentId: commentId,
          where: {likeBy: userId, commentId: commentId},
        });

        res.status(200)
            .json( new apiResponse({
              success: true,
              message: 'Comment Liked Successfully',
            }))
      }else {
        //already liked
        await db.commentlike.destroy({
          where: {likeBy: userId, commentId: commentId},
        });
        res.status(200)
        .json( new apiResponse({
          success: true,
          message: 'Comment UnLiked Successfully',
        }))
      }
    }catch (error) {
      return next(error);
    }
  })

  /**
   *  tweet like
   */
  static tweetLike = asyncHandler(async (req, res, next) => {

    const userId = req.user?.userId;
    const tweetId = req.params.tweetId;
    console.log("User ID:", userId);

    //validate for user and video ids
    check(userId);
    if (!tweetId) {
      throw new apiError({
        statusCode: 403,
        message: "tweet id not found",
      })
    }

    try {
      //validate already liked or not
      const tweetLiked = await db.tweetlike.findOne({
        where: { likeBy: userId, tweetId: tweetId },
      });
      //if liked
      if (tweetLiked) {
        await db.tweetlike.destroy({
          where: { likeBy: userId, tweetId: tweetId },
        });
        res.status(200).json(
          new apiResponse({
            success: true,
            message: "like removed from tweet",
          }),
        );
      } else {
        //if no like create an entry
        await db.tweetlike.create({
          likeBy: userId,
          tweetId: tweetId,
          where: { likeBy: userId, tweetId: tweetId },
        });

        res.status(200).json(
          new apiResponse({
            success: true,
            message: "Like success on tweet",
          }),
        );
      }
    } catch (error) {
      console.log(error);
      return next(error);
    }
  });

}

export default like_Controller;

function check(userId) {
  //validate userid
  if (!userId) {
    throw new apiError({
      statusCode: 403,
      message: "user not found",
    });
  }
}
