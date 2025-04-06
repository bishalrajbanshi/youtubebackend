import { sequelize } from "../config/connectDb.js";
import DataTypes from "sequelize";
import { nanoid } from "nanoid";
import UserModel from "./user.model.js";
import User from "./user.model.js";
import Video from "./video.model.js";

const Playlist = sequelize.define(
  "Playlist",
  {
    playlistId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: () => nanoid(),
    },
    playlistName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
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
  { tableName: "playlists", timestamps: true },
);

export  default Playlist;