import { sequelize } from "../config/connectDb.js";
import DataTypes  from "sequelize";
import User from "./user.model.js";
const Video = sequelize.define(
    'Video',
    {
        videoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        videoOwner:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                modelName:User,
                key: "userId"
            },
            onDelete: "CASCADE"
        },
        videoFile: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        thumbnail: {
            type: DataTypes.STRING,
            allowNull: true
        },

        title: {
            type: DataTypes.STRING(30),
            allowNull: false
        },

        description: {
            type: DataTypes.STRING(30),
            allowNull: false
        },

        views: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },

        isPublished: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

    },
    {
        tableName: "videos",
        timestamps: true
    }
)
export default Video;