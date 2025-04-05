import Router from "express";
import verifyJwt from "../middlewares/auth.middlewares.js";
import likeController from "../controllers/like.controller.js";

const router = Router();

router.use(verifyJwt);
router.route("/video/:videoId").post(likeController.videoLike);
router.route("/tweet/:tweetId").post(likeController.tweetLike);
router.route("/comment/:commentId").post(likeController.commentLike);


export default router;