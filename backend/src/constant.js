import { configDotenv } from "dotenv";
 configDotenv();

const username = process.env.USERNAME;
const dbname = process.env.DATABASENAME;
const dbpassword = process.env.DATABASEPASSWORD;
const port = process.env.PORT;
const origin = process.env.ORIGIN;

const ACCESSTOKENSECRET = process.env.ACCESSTOKENSECRET;
const ACCESSTOKENEXPIRY = process.env.ACCESSTOKENEXPIRY;

const REFRESHTOKENSECRET = process.env.REFRESHTOKENSECRET;
const REFRESHTOKENEXPITY = process.env.REFRESHTOKENEXPITY;

const CLOUD_NAME = process.env.CLOUD_NAME;
const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;
const CLOUD_API_KEY = process.env.CLOUD_API_KEY;

console.log(username,dbname,dbpassword,port);

export {
    username,
    dbname,
    dbpassword,
    port,origin

    ,
    ACCESSTOKENSECRET,
    ACCESSTOKENEXPIRY,

    REFRESHTOKENSECRET,
    REFRESHTOKENEXPITY,

    CLOUD_NAME,
    CLOUD_API_SECRET,
    CLOUD_API_KEY
}

