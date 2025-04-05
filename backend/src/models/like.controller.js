import { sequelize} from "../config/connectDb.js";
import DataTypes from "sequelize";
import Comment from "./comment.model.js";
import Video from "./video.model.js";
import User from "./user.model.js";
import Tweet from "./tweet.model.js";

const Like = sequelize.define("Like",{
    likeId: {
        type: DataTypes.INTIGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    commentId: {
        type: DataTypes.INTIGER,
        allowNull: false,
        references: {
            model: Comment,
            key: 'commentId',
        },
        onDelete: "CASCADE"
    },
    videoId: {
        type: DataTypes.INTIGER,
        allowNull: false,
        references: {
            model: Video,
            key: 'videoId',
        },
        onDelete: "CASCADE"
    },
    likeBy: {
        type: DataTypes.INTIGER,
        allowNull: false,
        references: {
            model: User,
            key: 'userId',
        },
        onDelete: "CASCADE"
    },
    tweetId: {
        type: DataTypes.INTIGER,
        allowNull: false,
        references: {
            model: Tweet,
            key: 'tweetId',
        },
        onDelete: "CASCADE"
    }
},{tableName: "likes", timestamps: true});

export default Like;
