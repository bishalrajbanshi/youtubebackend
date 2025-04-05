import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import { origin } from './constant.js';
import ErrorMiddleware from './middlewares/error-middlewares.js';

const app = express();

//defining cors
app.use(cors({
    origin: origin || '*',
    credentials: true,
}));

//limiting json 
app.use(express
    .json({
        limit:'20kb',
    })
);

//url encoded
app.use(express.urlencoded({
    extended:true, //accept object inside object
}));

//public accets
app.use(express.static("/public"));

//for cookies 
app.use(cookieParser());

//middleware for routes
import user_router from "./routes/user.routes.js";
import video_router from "./routes/user.video.routes.js";
import subscription_router from "./routes/subscrption.routes.js";
import comments_router from "./routes/comment.routes.js";
import tweet_router from "./routes/tweet.routes.js";

app.use("/api/v1/user",user_router);
app.use("/api/v1/video",video_router);
app.use("/api/v1/subscription",subscription_router);
app.use("/api/v1/comment",comments_router);
app.use("/api/v1/tweet",tweet_router);
//global error handler
app.use(ErrorMiddleware)


export { app }