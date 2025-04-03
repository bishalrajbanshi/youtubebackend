import { Router } from "express";
import user_controller from "../controllers/user.controller.js";
import getUsers from "../controllers/getallusers.js";
import upload from "../middlewares/multer.js";
import verifyJwt from "../middlewares/auth.middlewares.js";
const router = Router();

//user register route
router.route("/user-register").post(
    upload.fields(
        [
            { name: "avatar",maxCount:1},
            { name: "coverImage",maxCount :1}
        ]
    )
    ,user_controller.user_register);
router.route("/get-user").get(getUsers);

router.route("/log-in").post(user_controller.user_login);
router.route("/log-out").patch(verifyJwt,user_controller.user_logout)



export default router;