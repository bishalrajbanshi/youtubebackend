import { sequelize } from "../config/connectDb.js";
import DataTypes from "sequelize";
import User from "./user.model.js";
import {nanoid} from "nanoid";

const Subscription = sequelize.define(
  "Subscription",
  {
    subscriptionId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: () => nanoid(),
    },
    subscriber: {
      //my subscriber
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "userId",
        onDelete: "CASCADE",
      },
    },
    channel: {
      //to whome i subscribe
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "userId",
        onDelete: "CASCADE",
      },
    },
  },
  {
    tableName: "subscriptions", // Table name
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["subscriber", "channel"],
      },
    ],
  },
);

export default Subscription;
