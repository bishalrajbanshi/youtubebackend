import { sequelize } from "../config/connectDb.js";
import { DataTypes } from "sequelize";
import User from "./users.models.js";

const Tweet = sequelize.define( 
    "Tweet",
    {
        tweetId: {
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model:User,
                key:"userId"
            },
            onDelete:"CASCADE"
        },
        content: {
            type: DataTypes.STRING,
        }, 
    },{
        tableName:"tweets",
        timestamps: true,
    }
)

export default Tweet