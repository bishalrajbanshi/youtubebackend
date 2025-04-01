import { Router } from "express";
import user_register from "../controllers/user/user.register.js";

const router = Router();

//user register route
router.route("/user-register").post(user_register);



export default router;