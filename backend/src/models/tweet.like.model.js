import { sequelize } from "../config/connectDb.js";
import Database from "sequelize";
import DataTypes from "sequelize";
import Tweet from "./tweet.model.js";
import User from "./user.model.js";
import {nanoid} from "nanoid";

const TweetLike = sequelize.define(
    "TweetLike",
    {
        likeId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true,
            defaultValue: () => nanoid(),
        },
        likeBy: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: User,
                key: "userId",
                onDelete: "CASCADE",
            }
        },
        tweetId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: Tweet,
                key: "tweetId",
                onDelete: "CASCADE",
            }
        },
    },
    { timestamps: true, tableName: "tweetlikes" },
);

export default TweetLike;
