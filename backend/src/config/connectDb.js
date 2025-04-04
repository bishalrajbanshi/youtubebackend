import { Sequelize } from "sequelize";


const sequelize = new Sequelize("youtubebackend","admin","bishal",{
    host:'localhost',
    dialect:"mysql"
});
async function connectDb() {
    try {
        await sequelize.authenticate();
        // await sequelize.sync({alter:true})
        console.log("Database Connected");
    } catch (error) {
        console.error("database connection error",error);
    }
    return sequelize;
};

//for sutdown database
async function shutdown() {
    try {
        console.log("Terminating Database");
        await sequelize.close();
        console.log("Database Terminated");
        process.exit(0);
    } catch (error) {
        console.error("Error terminating database",error);
    } finally { 
        process.exit(0)
    }
};

function handleShutDown() {
    process.on('SIGINT',async ()=>{
        console.log("Termination Signal recived SIGINIT");
        await shutdown();
    });

    process.on('SIGTERM',async()=>{
        console.log("Termination Signal recived SIGTERM");
        await shutdown();
    })
}


export { sequelize, connectDb, handleShutDown} 