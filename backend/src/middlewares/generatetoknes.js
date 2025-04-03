import jwt from "jsonwebtoken";
import { 
    ACCESSTOKENEXPIRY,
    ACCESSTOKENSECRET ,
    REFRESHTOKENSECRET,
    REFRESHTOKENEXPITY
} from "../constant.js";


async function generateAccessToken(user) {
    return jwt.sign({
      userId: user.userId,
      email: user.email,
      username: user.username
    },ACCESSTOKENSECRET, {
      expiresIn: ACCESSTOKENEXPIRY
    });
};


async function generateRefreshToken(user) {
    return jwt.sign({
      userId: user.userId,
      email: user.email,
    }, REFRESHTOKENSECRET, {
      expiresIn: REFRESHTOKENEXPITY
    })
  };


  export { 
    generateAccessToken,
    generateRefreshToken
  }
  
