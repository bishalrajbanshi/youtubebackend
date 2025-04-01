import { asyncHandler } from "../../utils/asyncHandler.js";
import apiError from "../../utils/apiError.js";
import apiResponse from "../../utils/apiResponse.js";
import User from "../../models/users.models.js";

const user_register = asyncHandler(async(req, res, next) => {
    try {
        const { username, fullname, email, password } = req.body;
        console.log(username,email,password);
        

        // Manual validation
        if (!username || !fullname || !email || !password) {
            throw new apiError({
                statusCode: 400,
                message: "VALIDATION FAILED",
                errors: [
                  (!username ? [{ field: "user_name", message: "USERNAME IS REQUIRED" }] : []),
                  (!fullname ? [{ field: "full_name", message: "FULL NAME IS REQUIRED" }] : []),
                  (!email ? [{ field: "email", message: "EMAIL IS REQUIRED" }] : []),
                  (!password ?  []:[{ field: "password", message: "PASSWORD IS REQUIRED" }] )
                ]
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new apiError({
                statusCode: 409,
                message: "EMAIL ALREADY REGISTERED",
                errors: [{ field: "email"}]
            });
        }

        // Create user
        const newUser = await User.create({
            user_name: username,
            full_name: fullname,
            email: email,
            password: password 
        });

        return res.status(201).json(
            new apiResponse({
                statusCode: 201,
                message: "USER REGISTERED SUCCESSFULLY",
                data: {
                   newUser
                },
                success: true
            })
        );

    } catch (error) {
        return next(error);
    }
});
export default user_register;