import { app } from "./app.js";
import { port } from "./constant.js";
import { connectDb, handleShutDown } from "./config/connectDb.js";

connectDb()
.then(()=> {
    app.listen(port,()=>{
        console.log(`server listening with port : ${port}`);
    });
    handleShutDown();
})
.catch((error)=>{
    console.error("mysql database connection error",error);
    process.exit(1);
})