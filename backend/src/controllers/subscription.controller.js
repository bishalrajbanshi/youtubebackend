import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import db from "../models/index.js";

/**
 * Subscription controller
 */

class subscriptions_controller {
  /**
   * user subscriber (my subscriber)
   */
  static userSubscriber = asyncHandler(async (req, res, next) => {
    const channelId = req.params.channelId;
    const userId = req.user?.userId;
    //validate channel id from params
    if (!channelId) {
      throw new apiError({
        statusCode: 403,
        message: "channel id not found",
      });
    }
    //validate userid
    if (!userId) {
      throw new apiError({
        statusCode: 403,
        message: "user not found",
      });
    }

    if (Number(channelId) === Number(userId)) {
        throw new apiError({
            statusCode: 403,
            message: "You cannot subscribe to your own channel"
        });
    }

    try {
      //check for channel exist
      const channel = await db.user.findByPk(channelId);
      const channelname = channel.channelName;

      if (!channel) {
        throw new apiError({
          statusCode: 403,
          message: "channel not exist",
        });
      }
      //check for user exist
      const existUser = await db.user.findByPk(userId);
      if (!existUser) {
        throw new apiError({
          statusCode: 400,
          message: "login to subscribe",
        });
      }

      //check fro alreasy subscribe
      const subscribed = await db.subscription.findOne({
        where: {
          subscriber: userId,
          channel: channelId,
        },
      });
      if (subscribed) {
        throw new apiError({
          success: true,
          message: "Already subscribed",
        });
      }

      //update the subscription model
      await db.subscription.create({
        subscriber: userId,
        channel: channelId,
      });

      res.status(200).json(
        new apiResponse({
          success: true,
          message: `you subscribe to the channel ${channelname}`,
        }),
      );
    } catch (error) {
      return next(error);
    }
  });

  /**
   * user unsubscribe
   */

  static userUnsubscribe = asyncHandler(async(req,res,next) => {
        const userId = req.user?.userId;
        const channelId = req.params.channelId;
        console.log("ids",userId,channelId);
        
         //validate channel id from params
         check(userId,channelId);
  
        try {
            const subscription = await db.subscription.findOne({
                where:{
                    subscriber: userId,
                    channel: channelId,
                },
                include:[
                    {
                        model:db.user,
                        as:"channeluser",
                        attributes:["channelName"]
                    }
                ]
            }); 
            
            if (!subscription) {
                throw new apiError({
                    statusCode:400,
                    message: "Subscription not found",
                })
            };
            const channelname = subscription.channeluser?.channelName;
            await subscription.destroy();

            res.status(200)
            .json(new apiResponse({
                success:true,
                message:`you unsubscribe the ${channelname}`
            }));

        } catch (error) {
            return next(error);
        }
  })
}


function check(userId,channelId) {
    if (!channelId) {
        throw new apiError({
          statusCode: 403,
          message: "channel id not found",
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

export default subscriptions_controller;
