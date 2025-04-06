import { asyncHandler} from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import db from "../models/index.js";

/**
 * controller for playlist
 */
class playlist_controller {

    /**
     * playlist
     */
    static createPlaylist = asyncHandler(async (req,res,next)=>{

        const userId=req.user?.userId;
        const videoId=req.params.videoId;
        const {playlistName}=req.body;
        if(!playlistName){
            throw new apiError({
                statusCode:400,
                message:"Please enter playlist name"
            })
        }
        //validate fro user and video
        validate(userId,playlistName);
        try {
            //check for playlist
            const playlist = await  db.playlist.findOne({
                where:{userId: userId,playlistName:playlistName},
            });
            if(playlist){
                 new apiError({
                    statusCode:400,
                    message:"Playlist already exists with this name"
                })
            }
            //if not  playlist
            await  db.playlist.create({
                playlistName:playlistName,
                videoId:videoId,
                userId: userId,
            });

            res.status(200)
                .json( new apiResponse({
                    success: true,
                    message:"Successfully created playlist"
                }));

        }catch (error){
            console.log(error);
            return next(error);
        }
    })

    /**
     * add video in playlist where playlist already exist
     */
    static addVideo = asyncHandler(async (req,res,next)=>{
        const userId=req.user?.userId;
        const videoId=req.params.videoId;
        const playlistId=req.params.playlistId;
        try {
            //find the playlist
            const playlist = await  db.playlist.findOne({
                where:{userId: userId,playlistId:playlistId},
            });
            if(!playlist){
                throw new apiError({
                    statusCode:400,
                    message:"playlist not found"
                })
            }
            //find the videos
            const videoIds = await db.video.findOne({
                where:{videoId: videoId},
            });
            if (!videoIds){
                throw new apiError({
                    statusCode:400,
                    message:"videoId not found"
                })
            }
            //update the table
            await db.playlist.update({

            })

        }catch (error) {

        }
    })

}

function validate(userId,videoId) {
    if(!userId){
        throw new apiError({
            status:"400",
            message:"userId is required",
        })
    };
    if(!videoId){
        throw new apiError({
            status:"400",
            message:"videoId is required",
        })
    }
}