import { configDotenv } from "dotenv";
 configDotenv();

const username = process.env.USERNAME;
const dbname = process.env.DATABASENAME;
const dbpassword = process.env.DATABASEPASSWORD;
const port = process.env.PORT;
const origin = process.env.ORIGIN;

console.log(username,dbname,dbpassword,port);

export {
    username,
    dbname,
    dbpassword,
    port,origin
}

