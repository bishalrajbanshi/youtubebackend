    import { sequelize } from "../config/connectDb.js";
    import DataTypes from "sequelize";
    import User from "./user.model.js";
    import {nanoid} from "nanoid";

    const Tweet = sequelize.define(
      "Tweet",
      {
        tweetId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true,
            defaultValue: () => nanoid(),
        },
        ownerId: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model: User,
            key: "userId",
            onDelete: "CASCADE"
          }
        },
        content: {
          type: DataTypes.STRING,
        },
      },
      { tableName: "tweets", timestamps: true },
    );

    export  default  Tweet;
