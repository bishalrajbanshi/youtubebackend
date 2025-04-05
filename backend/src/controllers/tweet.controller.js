import  { asyncHandler} from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import {userPayload} from "../utils/excludesData.js";
import db from "../models/index.js";

/**
 * tweets create and delete controller
 */

class tweet_controller {
    /**
     * create tweet
     */

    static  createTweet = asyncHandler((async (req,res,next)=>{
        const userId = req.user?.userId;
        const {tweet} = req.body;
        if(!tweet){
           throw  new apiError({
               statusCode: 401,
               message: 'Tweet not found.',
           })
        }
        console.log("userId ",userId);
        if (!userId) {
            throw new apiError({
                statusCode: 401,
                message: 'Not authorized'
            })
        }
        try {
            //find the user
            const existUser = await db.user.findByPk(userId,{
                attributes:{exclude:userPayload}
            });
            console.log("existUser", existUser);
            if (!existUser) {
                throw new apiError({
                    statusCode: 401,
                    message: 'Not authorized user'
                })
            }

            await db.tweet.create({
                    ownerId:userId,
                    content: tweet
            });

            res.status(200)
                .json( new apiResponse({
                    success :true,
                    message: 'Successfully tweet'
                }));


        } catch (error) {
            console.log(error);
            return next(error);
        }
    }));


    /**
     * edit tweets
     */

    static editTweet =asyncHandler(async (req,res,next)=>{
        const userId = req.user?.userId;
        const { newTweet } = req.body;
        const tweetId= req.params.tweetId;
        console.log("userId ",userId);
        console.log("tweetId ",tweetId);
        console.log("edit tweet",newTweet);


        //validate tweet and user
        check(userId,tweetId);
        try {

            //find the tweet
            const tweet = await db.tweet.findOne({
                where:{tweetId:tweetId, ownerId:userId},
                attributes:{exclude:["content","createdAt","updatedAt"]}
            });
            if(!tweet){
                throw new apiError({
                    statusCode: 401,
                    message: 'Tweet not found.',
                })
            }
            //save to the database
            await db.tweet.update(
                {content: newTweet},
                {where:{tweetId:tweetId, ownerId:userId},}
            );

            res.status(200)
                .json( new apiResponse({
                    success :true,
                    message: 'Successfully edited'
                }));

        }catch (error) {
            return next(error);
        }

    })


    /**
     * delete tweets
     */

    static  deleteTweet = asyncHandler((async (req,res,next)=>{
        const userId = req.user?.userId;
        const tweetId = req.params.tweetId;
        //validate tweet and user
        check(userId,tweetId);
        try {
            //find the tweet
            const tweet = await db.tweet.findOne({
                where:{
                    tweetId:tweetId,
                    ownerId:userId,
                },
                attributes:{exclude:["content","ownerId","createdAt","updatedAt"]}
            });
            if (!tweet) {
                throw new apiError({
                    statusCode: 401,
                    message: 'Not authorized tweet'
                })
            }
            console.log("tweetId", tweet.tweetId);
            await tweet.destroy();

            res.status(200)
                .json( new apiResponse({
                    success :true,
                    message: `Successfully deleted tweet`,
                }))
        } catch (error){
            console.log(error);
            return next(error);
        }
    }))



}

export  default tweet_controller;

function check(userId,tweetId) {
    if(!userId){
        throw new apiError({
            statusCode: 401,
            message: 'Not authorized'
        })
    }
    if(!tweetId){
        throw new apiError({
            statusCode: 401,
            message: 'Not authorized tweet'
        })
    }
}
