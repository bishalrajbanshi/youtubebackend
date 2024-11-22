import { app } from "./app.js";
import dbconnection from "./db/db.Connection.js";


dbconnection()
.then(()=>{
    app.listen(process.env.PORT || 3000, () => {
        console.log(`SERVER IS RUNNING AT PORT : ${process.env.PORT}`);
        
    })
})
.catch((error)=>{
    console.error("MONGODB CONNECTION ERROR !! ",error);
    
})