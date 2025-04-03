import { sequelize } from "../config/connectDb.js";
import { DataTypes } from "sequelize";
import User from "./users.models.js";

const Subscription = sequelize.define(
    "Subscription",
    {
        subId: {
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false
        },
        subscriber: { //my subscriber 
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model:User,
                key:"userId"
            },
            onDelete:"CASCADE"
        },
        channel: { //to whome i subscribe
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model:User,
                key:"userId"
            },
            onDelete:"CASCADE"
        },
    },
    {
        tableName: "subscriptions", // Table name
        timestamps: true, 
        indexes: [
            {
                unique: true,
                fields: ["subscriber", "channel"]
            }
        ]
    }
    
);

export default Subscription;