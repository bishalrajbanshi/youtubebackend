import { sequelize } from "../config/connectDb.js";
import  DataTypes  from "sequelize";
import {nanoid} from "nanoid";


const User = sequelize.define("User", {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
    defaultValue: () => nanoid(),
  },

  userName: {
    type: DataTypes.STRING(8),
    allowNull: false,
    unique: true,
    set(value){
        this.setDataValue('userName',value.toLowerCase().trim())
    }
  },

  channelName: {
    type: DataTypes.STRING(20),
    allowNull: false, 
  },

  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull:{msg: "avatar is required"}
    }
  },

  coverImage: {
    type: DataTypes.STRING,
    // allowNull: true,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate:{
      notNull:{msg:"email required"}
    }
  },


  password: {
    type: DataTypes.STRING(70),
    allowNull: false,
    validate: {
      notNull: {
        msg: "Password is required"
      },
      len: {
        args: [1, 70],
        msg: "Password must be between 5 and 10 characters"
      }
    }
  },

  role: {
    type: DataTypes.STRING,
    defaultValue: "user",
    allowNull: false
  },

  isLoggedIn: {
    type: DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue: false
  },

  refreshToken: {
    type: DataTypes.STRING,
  },

},{
    tableName: "users",
    timestamps: true
  }
);


export default User;
 