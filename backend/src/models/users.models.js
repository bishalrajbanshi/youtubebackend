import { sequelize } from "../config/connectDb.js";
import { DataTypes } from "sequelize";


const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  user_name: {
    type: DataTypes.STRING(8),
    allowNull: false,
    unique: true,
    set(value){
        this.setDataValue('user_name',value.toLowerCase().trim())
    }
  },

  full_name: {
    type: DataTypes.STRING(20),
    allowNull: false,
    
  },

  // avatar: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  //   validate: {
  //     isUrl: { msg: "avatar must be valid url" },
  //     notNull: { msg: "profile image is required" },
  //   },
  // },

  // cover_image: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  //   validate: {
  //     isUrl: { msg: "cover image should be valid url" },
  //   },
  // },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },


  password: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
        // isNull: {msg: "password is required"},
        len: {args: [5,10], msg: "password must min 5 and max 10 char"}
    },
  },

  role: {
    type: DataTypes.STRING,
    defaultValue: "user",
    allowNull: false
  },

  // refresh_token: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },

},{
    tableName: "users",
    timestamps: true
  }
);


export default User;
 