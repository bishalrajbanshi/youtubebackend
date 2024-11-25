import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { configDotenv } from "dotenv"
configDotenv()



const app = express()

//accept origine
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//limit for json
app.use(express.json(
    {
        limit:"16kb"
    }
))
//limit for url
app.use(express.urlencoded(
    {
        extended: true, //nested object
        limit: "16kb"
    }
))

//static file for public accets
app.use(express.static("public"))

//cookie config work = accept cookie, set cookie form user browser(CRUD)
app.use(cookieParser())

//routes
import userRouter from "./route/user.route.js"

//route decleration
app.use("/api/v1/users",userRouter)


// example:  http://localhost:8000/api/v1/users/register
export { app }





// req.pramps = request from url
//req.body = json,forms

//congig setting for app.user