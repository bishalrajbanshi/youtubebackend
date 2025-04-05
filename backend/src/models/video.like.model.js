import { sequelize } from "../config/connectDb.js";
import DataTypes from "sequelize";
import User from "./user.model.js";
import Video from "./video.model.js";
import {nanoid} from "nanoid";

const VideoLike = sequelize.define(
  "videoLike",
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
      },
    },
    videoId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Video,
        key: "videoId",
        onDelete: "CASCADE",
      },
    },
  },
  { tableName: "videolikes", timestamps: true },
);

export default VideoLike;
