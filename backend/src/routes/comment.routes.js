import Router from "express";
import verifyJwt from "../middlewares/auth.middlewares.js";
import comment_controller from "../controllers/comment.controller.js";
const router = Router();

//secure routes
router.use(verifyJwt);
router.route("/:videoId").post(comment_controller.createComment);
router.route("/delete/:videoId").delete(comment_controller.deleteComment)
router.route("/edit/:videoId/:commentId").put(comment_controller.editComment);

export default router;