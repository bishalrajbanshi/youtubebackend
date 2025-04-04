import Video from "./users.videos.models.js";
import User from "./users.models.js";
import Subscription from "./subscription.model.js";
import Tweet from "./tweets.model.js";
const db= {};

db.user=User;
db.video=Video;
db.subscription=Subscription;
db.tweet=Tweet;

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
    as:"channeluser" //call model name
});

//tweets 
db.user.hasMany(db.tweet, {
    foreignKey:"ownerId",
    as:"tweets"
});
db.tweet.belongsTo(db.user,{
    foreignKey: "ownerId",
    as:"user"
});
db.video.hasMany(db.tweet,{
    foreignKey:"vId",
    as:"usertweets"
});
db.tweet.belongsTo(db.video, {
    foreignKey: "vId",
    as:"video"
})


export default db;