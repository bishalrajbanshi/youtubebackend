import { sequelize } from "../config/connectDb.js";
import { DataTypes } from "sequelize";

const scubscription = sequelize.define(
    "Scubcription",
    {
        subId: {
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false
        }
    }
)