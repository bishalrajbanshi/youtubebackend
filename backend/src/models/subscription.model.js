import { sequelize } from "../config/connectDb.js";
import DataTypes  from "sequelize";
import User from "./user.model.js";

const Subscription = sequelize.define(
    "Subscription",
    {
        
        subscriptionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull:false,
            autoIncrement:true
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