import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
     
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true 
        },
        avatar: {
            type: String, //cludinary url
            required: true
        },
        coverImage: {
            type: String
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, "Password is Required"]
        },
        refreshToken: {
            type: String
        }
    },{ timestamps:true }
)
//do before save
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next()
})

//custom methods
userSchema.methods.isPasswordCorrect = async function(password){
    //compare cleartextpassword , encrypted password
  return  await bcrypt.compare(password,this.password)
}

// injecting accesstoken (doesnot store in database)
userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiredIn: process.env.ACCCESS_TOKEN_EXPIRY
        }
    )
}

//injecting refresh token save in database
userSchema.methods.generateRefreshTOken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiredIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)