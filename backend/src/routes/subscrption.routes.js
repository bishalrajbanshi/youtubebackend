import { Router } from "express";
import verifyJwt from "../middlewares/auth.middlewares.js";
import subscriptions_controller from "../controllers/subscription.controller.js";
const router = Router();

//secure routes
router.use(verifyJwt);
router.route("/:channelId").post(subscriptions_controller.userSubscriber);
router.route("/unsubscribe/:channelId").put(subscriptions_controller.userUnsubscribe);

export default router;