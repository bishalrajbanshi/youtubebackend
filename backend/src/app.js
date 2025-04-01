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
    limit:"16kb"
}));

//public accets
app.use(express.static("/public"));

//for cookies 
app.use(cookieParser());

//middleware for routes
import user_router from "./routes/user.routers.js";
app.use("/api/v1",user_router);

//global error handler
app.use(ErrorMiddleware)


export { app }