import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import db from "../models/index.js";
import { userPayload, videoPayload } from "../utils/excludesData.js";
/**
 * tweets controller 
 */

class tweets_controller {
    
    /**
     * tweets by user
     */
    static createTweet = asyncHandler(async(req,res,next) => {
        const userId= req.user?.userId;
        const videoId= req.params.videoId;
        const {tweet} =  req.body;
        
        //vaidate video and user
        check(userId,videoId);
         //validat etweet
      if (!tweet) {
        throw new apiError({
          statusCode: 403,
          message: "tweet is required",
        });
      } 

        try {
            //find the user
            const existUser = await db.user.findByPk(userId,{
                attributes: {exclude:userPayload}
            });
            if (!existUser) {
                throw new apiError({
                    statusCode:400,
                    message:"unauthorize to tweet"
                })
            };
            console.log("exxist user",existUser);

            //video esist or tweet
            const existVideo = await db.video.findByPk(videoId, {
                attributes: {exclude: videoPayload}
            })
            console.log("exxist video",existVideo);
            if (!existVideo) {
                throw new apiError({
                    statusCode: 400,
                    message:"video not exist to tweet",
                    content:tweet
                })
            };
            const videotitle = existVideo.title;
            console.log("title",videotitle);
            

            // create tweeets
            await db.tweet.create({
                ownerId: userId,
                vId: videoId,
                content: tweet
            });


            res.status(200)
            .json(new apiResponse({
                success:true,
                message:`yoou tweeted on ${videotitle}`
            }));

        } catch (error) {
            return next(error)
        }


    });



    /**
     * delete tweet
     */
    static deleteTweet = asyncHandler(async(req,res,next) => {
        const userId = req.user?.userId;
        const videoId = req.params.videoId;
        //validate it
        check(userId,videoId);

        try {
            //find tweets 
            const tweets = await db.tweet.findOne({
                where: {
                    ownerId: userId,
                    vId: videoId
                },
                include: [
                    {
                        model: db.video,
                        as: "video",
                        attributes:["title"]
                    }
                ]
            });
            const deleteTitle = tweets?.video?.title;
            console.log("deleted title",deleteTitle);
            console.log("tweets",tweets);
            
            

            //validate tweet 
            if (!tweets) {
                throw new apiError({
                    statusCode: 400,
                    message:"no tweets"
                })
            };
            await tweets.destroy();

            res.status(200)
            .json( new apiResponse({
                success: true,
                message: `you deleted tweet from ${deleteTitle}`
            }))

        } catch (error) {
            console.log("error",error);
            return next(error)
            
        }
    })
}

export default tweets_controller;

function check(userId,videoId) {
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
      };
}