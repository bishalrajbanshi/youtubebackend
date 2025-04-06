import { Router } from "express";;
import verifyJwt from "../middlewares/auth.middlewares.js";
import video_controller from "../controllers/video.controller.js";
import upload from "../middlewares/multer.js";

const router = Router();

router.route("/upload").post(
    upload.fields(
        [
            { name: "thumbnail", maxCount:1},
            { name: "video",maxCount:1}
        ]
    )
    ,verifyJwt,video_controller.videoUpload);


router.route("/edit-video/:id").put(
    upload.fields([
        {
            name:"thumbnail",
            maxCount:1
        },
        {
            name:"video",
            maxCount:1
        }
    ])
    ,verifyJwt,video_controller.editVideo)

router.route("/watch/:videoId").get( video_controller.getVideo);

export default router;