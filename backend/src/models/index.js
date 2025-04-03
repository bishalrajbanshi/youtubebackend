import Video from "./users.videos.models.js";
import User from "./users.models.js";

const db= {};

db.user=User;
db.video=Video;

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

export default db;