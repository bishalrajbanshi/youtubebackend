import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import db from "../models/index.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { extractPublicId } from "cloudinary-build-url";
import {
  hideCommentData,
  hideCommentLikeData,
  hideVideoData,
  hideVideoLikeData,
  userPayload
} from "../utils/excludesData.js";

class video_controller {
  /**
   * video uploader
   */
  static videoUpload = asyncHandler(async (req, res, next) => {
    try {
      const { title, description, isPublished } = req.body;
      console.log(title, description, isPublished);
      const userId = req.user?.userId;
      console.log("userId", userId);

      if (!userId) {
        throw new apiError({
          statusCode: 404,
          message: "unauthorize user",
        });
      }

      if (!title || !description || !isPublished) {
        throw new apiError({
          statusCode: 401,
          message: "all fields are required",
        });
      }

      //find current user
      const currentUser = await db.user.findByPk(userId);

      if (!currentUser) {
        throw new apiError({
          statusCode: 400,
          message: "unauthorized",
        });
      }

      //get the video and thumbnails
      const thumbnail = req.files?.thumbnail?.[0].path;
      const video = req.files?.video?.[0].path;
      if (!video) {
        throw new apiError({
          statusCode: 400,
          message: "video required",
        });
      }

      //upload to cloudinary
      const newThumbnail = await uploadOnCloudinary(thumbnail);
      const newVideos = await uploadOnCloudinary(video);

      //create new video
      await db.video.create({
        title: title,
        description: description,
        videoFile: newVideos.url,
        thumbnail: newThumbnail?.url,
        isPublished: isPublished,
        videoOwner: currentUser.userId,
      });

      return res.status(201).json(
        new apiResponse({
          message: "video uploaded",
          success: true,
        }),
      );
    } catch (error) {
      console.log("error in uploads", error);
      return next(error);
    }
  });

  /**
   * edit videos
   */

  static editVideo = asyncHandler(async (req, res, next) => {
    const videoId = req.params.id;
    const userId = req.user?.userId;
    const { title, description } = req.body;

    //validate user
    if (!userId) {
      throw new apiError({
        statusCode: 400,
        message: "unauthorize user",
      });
    }
    try {
      //find video
      const video = await db.video.findByPk(videoId,{
          attributes: {exclude:userPayload}
          }
          );
      //request  video and and thumbnail
      const videoPath = req.files?.video?.[0].path;
      const thumbnailPath = req.files?.thumbnail?.[0].path;
      if (videoPath && thumbnailPath) {
        videoLink(videoPath);
        thumbnailLink(thumbnailPath);
      }
      if (videoPath) {
        videoLink(videoPath);
      }
      if(thumbnailPath) {
        thumbnailLink(thumbnailPath);
      }

      if (!video) {
        throw new apiError({
          statusCode: 401,
          message: "video not found",
        });
      }

      //check safe for owner of video
      if (video.videoOwner !== userId) {
        throw new apiError({
          statusCode: "403",
          message: "you are unauthorized to edit video",
        });
      }

      const videoLinkPath = await uploadOnCloudinary(videoPath);
      const thumbnailLinkPath = await uploadOnCloudinary(thumbnailPath);

      //update the model or schema
      await db.video.update(
        {
          title: title || video.title,
          description: description || video.description,
          videoFile: videoLinkPath?.url || video.videoFile,
          thumbnail: thumbnailLinkPath?.url || video.thumbnail,
        },
        {
          where: { videoId: videoId }, //passsing coloumn name and current id
        },
      );

      return res.status(200).json(
        new apiResponse({
          success: true,
          message: "video updated",
        }),
      );
    } catch (error) {
      console.log(error);
      return next(error);
    }
  });

  /**
   * get video
   */

  static getVideo = asyncHandler(async (req, res, next) => {
    const videoId = req.params.videoId;

    if (!videoId) {
      throw new apiError({
        statusCode: 404,
        message: "video not found",
      });
    }
    try {
      const video = await db.video.findOne({
        where: { videoId: videoId },
        attributes: { exclude: hideVideoData },
        include: [
          {
            model: db.user,
            as: "user",
            attributes: { exclude: userPayload },
          },
          {
            model: db.videolike,
            as: "videoLikes",
            attributes: { exclude: hideVideoLikeData },
          },
          {
            model: db.comment,
            as: "comments",
            attributes: { exclude: hideCommentData },
            include: [
              {
                model: db.user,
                as: "user",
                attributes: { exclude: userPayload },
              },
            ],
          },
        ],
      });

      return res.status(200).json(
        new apiResponse({
          success: true,
          statusCode: 200,
          data: video,
          message: "User's videos list",
        }),
      );
    } catch (error) {
      return next(error);
    }
  });
}

export default video_controller;

function videoLink(videoUrl) {
  const videoPublicId = extractPublicId(videoUrl);
  const deleteVideo = deleteFromCloudinary(videoPublicId);
  console.log(deleteVideo);
  return deleteVideo;
}
function thumbnailLink(thumbnailUrl) {
  const thumbnailPublicId = extractPublicId(thumbnailUrl);
  const deleteThumbnail = deleteFromCloudinary(thumbnailPublicId);
  console.log(deleteThumbnail);
  return deleteThumbnail;
}
// include :[
//   {
//     model: db.commentlike,
//     as: "commentLikes",
//     attributes: {exclude: hideCommentLikeData},
//     include :[
//       {
//         model: db.user,
//         as: "user",
//         attributes:{ exclude:userPayload },
//       }
//     ]
//   }
// ]