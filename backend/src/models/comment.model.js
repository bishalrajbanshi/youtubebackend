import { sequelize } from "../config/connectDb.js";
import  DataTypes  from "sequelize";
import User from "./user.model.js";
import Video from "./video.model.js";

const Comment = sequelize.define(
    "Comment",
    {
        commentId: {
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
        vId: {
            type: DataTypes.INTEGER,
            allowNull:false,
            references: {
                model:Video,
                key:"videoId"
            },
            onDelete:"CASCADE"
        },
        content: {
            type: DataTypes.STRING,
        }, 
    },{
        tableName:"comments",
        timestamps: true,
        indexes:[
            {
                unique:true,
                fields:["vId","userId","content"],
            }
        ]
    }
)

export default Comment;