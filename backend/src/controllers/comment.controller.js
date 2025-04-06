import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import db from "../models/index.js";
import { userPayload, videoPayload } from "../utils/excludesData.js";
import models from "../models/index.js";
/**
 * comment controller
 */

class comment_controller {
  /**
   * comments by user
   */
  static createComment = asyncHandler(async (req, res, next) => {
    const userId = req.user?.userId;
    const videoId = req.params.videoId;
    const { comment } = req.body;
    console.log("videoId", videoId);

    //vaidate video and user
    check(userId, videoId);
    //validate comment
    if (!comment) {
      throw new apiError({
        statusCode: 403,
        message: "comment is required",
      });
    }

    try {
      //find the user
      const existUser = await db.user.findByPk(userId, {
        attributes: { exclude: userPayload },
      });
      if (!existUser) {
        throw new apiError({
          statusCode: 400,
          message: "unauthorized to comment",
        });
      }
      console.log("exist user", existUser);

      //video exist or comment
      const existVideo = await db.video.findByPk(videoId, {
        attributes: { exclude: videoPayload },
      });
      console.log("exist video", existVideo);
      if (!existVideo) {
        throw new apiError({
          statusCode: 400,
          message: "video not exist to comment",
        });
      }
      const videoTitle = existVideo.title;
      console.log("title", videoTitle);

      // create tweeets
      await db.comment.create({
        ownerId: userId,
        videoId: videoId,
        content: comment,
      });

      res.status(200).json(
        new apiResponse({
          success: true,
          message: `you commented on ${videoTitle}`,
        }),
      );
    } catch (error) {
      return next(error);
    }
  });

  /**
   * edit comments
   */

  static editComment = asyncHandler(async (req, res, next) => {
    const userId = req.user?.userId;
    const videoId = req.params.videoId;
    const commentId = req.params.commentId;
    const { newComment } = req.body;

    //validate user and video
    check(userId, videoId);
    if (!commentId) {
        throw new apiError({
            statusCode: 400,
            message: "commentId is required",
        })
    }
    try {
      //find comment
      const comment = await db.comment.findOne({
        where: { commentId:commentId,ownerId: userId, videoId: videoId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      })
        console.log("comment", comment);
      if (!comment) {
        throw new apiError({
          statusCode: 400,
          message: "unauthorized to comment",
        });
      }
      await db.comment.update(
        { content: newComment },
        { where: { commentId:commentId,ownerId: userId, vId: videoId } },
      );

      res.status(200).json(
        new apiResponse({
          success: true,
          message: "comment successfully",
        }),
      );
    } catch (error) {
      return next(error);
    }
  });

  /**
   * delete tweet
   */
  static deleteComment = asyncHandler(async (req, res, next) => {
    const userId = req.user?.userId;
    const videoId = req.params.videoId;
    //validate it
    check(userId, videoId);

    try {
      //find comments
      const comment = await db.comment.findOne({
        where: {
          ownerId: userId,
          videoId: videoId,
        },
        include: [
          {
            model: db.video,
            as: "video",
            attributes: ["title"],
          },
        ],
      });

      const deleteTitle = comment?.video?.title;
      console.log("deleted title", deleteTitle);
      console.log("comment", comment);
      //validate tweet
      if (!comment) {
        throw new apiError({
          statusCode: 400,
          message: "no tweets",
        });
      }
      await comment.destroy({
        where: {ownerId:userId, videoId:videoId },
      });

      res.status(200).json(
        new apiResponse({
          success: true,
          message: `you deleted comment from ${deleteTitle}`,
        }),
      );
    } catch (error) {
      console.log("error", error);
      return next(error);
    }
  });
}

export default comment_controller;

function check(userId, videoId) {
  if (!videoId) {
    throw new apiError({
      statusCode: 403,
      message: "video id not found",
    });
  }
  //validate userid
  if (!userId) {
    throw new apiError({
      statusCode: 403,
      message: "user not found",
    });
  }
}
