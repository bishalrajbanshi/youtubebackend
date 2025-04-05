import { sequelize } from "../config/connectDb.js";
import DataTypes from "sequelize";
import User from "./user.model.js";
import {nanoid} from "nanoid";
const Video = sequelize.define(
  "Video",
  {
    videoId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: () => nanoid(),
    },
    videoOwner: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        modelName: User,
        key: "userId",
        onDelete: "CASCADE",
      },
    },
    videoFile: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    title: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    views: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },

    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "videos",
    timestamps: true,
  },
);
export default Video;
