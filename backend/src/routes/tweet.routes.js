import Router from "express";
import tweet_controller from "../controllers/tweet.controller.js";
import verifyJwt from "../middlewares/auth.middlewares.js";


const router = Router();
router.use(verifyJwt)
router.route("/create").post(tweet_controller.createTweet);
router.route("/delete/:tweetId").delete(tweet_controller.deleteTweet);
router.route("/edit/:tweetId").put(tweet_controller.editTweet);


export default router;