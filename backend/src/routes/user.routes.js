import { Router } from "express";
import user_controller from "../controllers/user.controller.js";
import getUsers from "../controllers/getallusers.js";
import upload from "../middlewares/multer.js";
import verifyJwt from "../middlewares/auth.middlewares.js";
const router = Router();

//user register route
router.route("/register").post(
    upload.fields(
        [
            { name: "avatar",maxCount:1},
            { name: "coverImage",maxCount :1}
        ]
    )
    ,user_controller.userRegister);
router.route("/get-user").get(getUsers);
router.route("/log-in").post(user_controller.userLogin);


//secure toutes
router.use(verifyJwt)
router.route("/log-out").put(user_controller.userLogout);
router.route("/edit").put(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ])
    ,user_controller.editDetails);
router.route("/change").put(user_controller.changePassword)



export default router;