import { Router } from "express";;
import verifyJwt from "../middlewares/auth.middlewares.js";
import user_video_controller from "../controllers/user.video.controller.js";
import upload from "../middlewares/multer.js";

const router = Router();

router.route("/upload").post(
    upload.fields(
        [
            { name: "thumbnail", maxCount:1},
            { name: "video",maxCount:1}
        ]
    )
    ,verifyJwt,user_video_controller.videoUpload);

    router.route("/all").get(verifyJwt, user_video_controller.getVideos)


export default router;