import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import db from "../models/index.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

class video_controller {
    /**
     * video uploader
     */

    static videoUpload = asyncHandler(async(req,res,next) => {
      try {
       const { title, description, isPublished }= req.body;
        console.log(title,description,isPublished);
          const userId = req.user?.userId;
          console.log("userId",userId);
          
          if (!userId) {
              throw new apiError({
                  statusCode: 404,
                  message: "unauthorize user"
              })
          }
       
          
          if (!title || !description || !isPublished) {
              throw new apiError({
                  statusCode: 401,
                  message: "all fields are required",
              })
          };
  
          //find current user
          const currentUser = await db.user.findByPk(userId);
          
          if (!currentUser) {
              throw new apiError({
                  statusCode:400,
                  message:"unauthorized"
              })
          };
  
          //get the video and thumbnails
          const thumbnail = req.files?.thumbnail?.[0].path;
          const video = req.files?.video?.[0].path;
          if (!video) {
              throw new apiError({
                  statusCode: 400,
                  message: "video required"
              })
          };

          //upload to cloudinary
          const newThumbnail = await uploadOnCloudinary(thumbnail);
          const newVideos = await uploadOnCloudinary(video);
          
          //create new video
          await db.video.create({
              title: title,
              description:description,
              videoFile: newVideos.url,
              thumbnail: newThumbnail?.url,
              isPublished:isPublished,
              videoOwner: currentUser.userId
          });
  
          return res.status(201)
          .json(new apiResponse({
              message:"video uploaded",
              success: true
          }))
  
      } catch (error) {
        console.log("error in uploads",error);
        return next(error)
      }
    });


    /**
     * edit videos
     */

    static editVdeo = asyncHandler(async(req,res,next) => {
        const videoId = req.params.id;
        const userId = req.user?.userId;
        const { title, description }= req.body;

        try {
            //validate user
            if (!userId) {
                throw new apiError({
                    statusCode:400,
                    message:"unauthorize user"
                })
            };

            console.log("userId",userId);
            
            console.log("recived videoID",videoId);
    
            
            const video = await db.video.findByPk(videoId);
            console.log("video",video);
            
            if (!video) {
                throw new apiError({
                    statusCode:401,
                    message:"video not found"
                })
            };

            //check safe fro owner of video
            if (video.videoOwner !== userId) {
                throw new apiError({
                    statusCode:"403",
                    message:"you are unauthorize to edit video"
                })
            };
            

            //request  video and and thumbnail
            const videoPath = req.files?.video?.[0].path;
            const thumbnailPath = req.files?.thumbnail?.[0].path;

            const videoLink = await uploadOnCloudinary(videoPath);
            const thumbnailLink = await uploadOnCloudinary(thumbnailPath);

            //update the model or schema
            await db.video.update({
                title:title || video.title,
                description: description || video.description,
                videoFile: videoLink?.url || video.videoFile,
                thumnail: thumbnailLink?.url || video.thumbnail
            },
            {
                where:{videoId:videoId} //passsing coloumn name and current id
            }
        );

            return res.status(200)
            .json(new apiResponse({
                success:true,
                message:"video updated"
            }))



        } catch (error) {
            console.log(error);
            return next(error);
        }

    })

    /**
     * get video
     */

    static getVideos = asyncHandler(async(req,res,next) => {
        const userId = req.user?.userId;
        
        if (!userId) {
            throw new apiError({
                statusCode: 404,
                message: "unauthorize user not found"
            })
        };
        try {
            const videos = await db.video.findAll({
                where: { videoOwner:userId },
                include: [{       
                 model: db.user,// owver of the video 
                  as: 'user',
                  // required:true, // this is for inner join
                  attributes:["userName","channelName"]
                }],
                attributes:["videoId","videoFile","videoOwner","thumbnail","title","description","views","createdAt"]
              });

            return res.status(200).json(new apiResponse({
                success: true,
                statusCode: 200,
                data: videos,
                message: "User's videos list",
            }));
        } catch (error) {
            return next(error)
        }
    })
}

export default video_controller;