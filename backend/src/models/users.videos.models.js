import { sequelize } from "../config/connectDb.js";
import { DataTypes } from "sequelize";
import User from "./users.models.js";

const Video = sequelize.define(
    'Video',
    {
        video_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true   
        },

        video_file: {
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

        duration: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        views: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },

        is_published: {
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