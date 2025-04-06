import { sequelize } from "../config/connectDb.js";
import Database from "sequelize";
import DataTypes from "sequelize";
import User from "./user.model.js";
import Comment from "./comment.model.js";
import { nanoid } from "nanoid";
import Video from "sequelize";

const CommentLike = sequelize.define(
  "CommentLike",
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
    commentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Comment,
        key: "commentId",
        onDelete: "CASCADE",
      },
    }
  },
  { tableName: "commentlikes", timestamps: true },
);

export default CommentLike;
