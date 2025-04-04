import Router from "express";
import tweets_controller from "../controllers/tweets.controller.js";
import verifyJwt from "../middlewares/auth.middlewares.js";
const router = Router();

//cecureroutes
router.use(verifyJwt);
router.route("/:videoId").post(tweets_controller.createTweet);
router.route("/delete/:videoId").delete(tweets_controller.deleteTweet)

export default router;