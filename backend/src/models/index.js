import Video from "./users.videos.models.js";
import User from "./users.models.js";
import Subscription from "./scuscription.model.js";
const db= {};

db.user=User;
db.video=Video;
db.subscription=Subscription

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



export default db;