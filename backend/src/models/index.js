import Video from "./video.model.js";
import User from "./user.model.js";
import Subscription from "./subscription.model.js";
import Comment from "./comment.model.js";
import Tweet from "./tweet.model.js";
import Like from "./like.controller.js";
const db= {};

db.user=User;
db.video=Video;
db.subscription=Subscription;
db.comment=Comment;
db.tweet=Tweet;
db.like=Like;

//relation-ship 

//with user
db.user.hasMany(db.video,{
    foreignKey: "videoOwner",
    as:"videos"
});
db.video.belongsTo(db.user,{
    foreignKey: "videoOwner",
    as:"user"
});

//subscriptions
db.user.hasMany(db.subscription,{ //user subscribe many channel
    foreignKey: "subscriber",
    as:"subscribers"
});

db.user.hasMany(db.subscription,{ //channel have many subscriber
    foreignKey:"channel",
    as:"subscribeChannel"
});

db.subscription.belongsTo(db.user,{
    foreignKey:"channel",
    as:"user" //call model name
});

//comments
db.user.hasMany(db.comment, {
    foreignKey:"ownerId",
    as:"comment"
});
db.comment.belongsTo(db.user,{
    foreignKey: "ownerId",
    as:"user"
});
db.video.hasMany(db.comment,{
    foreignKey:"vId",
    as:"comments"
});
db.comment.belongsTo(db.video, {
    foreignKey: "vId",
    as:"video"
});

//tweets
db.user.hasMany(db.tweet,{
    foreignKey:"ownerId",
    as:"tweets"
});
db.tweet.belongsTo(db.user, {
    foreignKey:"ownerId",
    as:"user"
})


export default db;