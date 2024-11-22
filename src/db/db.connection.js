import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { DB_NAME } from "../constants.js";
configDotenv()

const dbconnection = async () => {
    try {

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI} / ${DB_NAME}`)
        console.log(`MONGODB CONNECTED !! HOST: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.error("MONGODB CONNECTION FAILED", error);
        process.exit(1)
    }
}


export default dbconnection