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

router.route("/watch").get(verifyJwt, video_controller.getVideos);

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
    ,verifyJwt,video_controller.editVdeo)


export default router;