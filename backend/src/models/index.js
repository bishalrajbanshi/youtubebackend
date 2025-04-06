import Video from "./video.model.js";
import User from "./user.model.js";
import Subscription from "./subscription.model.js";
import Comment from "./comment.model.js";
import Tweet from "./tweet.model.js";
import VideoLike from "./video.like.model.js";
import CommentLike from "./cmment.like.model.js";
import TweetLike from "./tweet.like.model.js";
import Playlist from "./playlist.model.js";
const db= {};

db.user=User;
db.video=Video;
db.subscription=Subscription;
db.comment=Comment;
db.tweet=Tweet;
db.videolike=VideoLike;
db.commentlike=CommentLike;
db.tweetlike=TweetLike;
db.playlist=Playlist;

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
    foreignKey:"videoId",
    as:"comments"
});
db.comment.belongsTo(db.video, {
    foreignKey: "videoId",
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
});



//video likes
db.user.hasMany(db.videolike, {
    foreignKey:"likeBy",
    as:"userVideoLike"
});
db.videolike.belongsTo(db.user, {
    foreignKey:"likeBy",
    as:"user"
});
db.video.hasMany(db.videolike,{
    foreignKey:"videoId",
    as:"videoLikes"
});
db.videolike.belongsTo(db.video,{
    foreignKey:"videoId",
    as:"videos"
});

//comment likes
db.user.hasMany(db.commentlike, {
    foreignKey:"likeBy",
    as:"userCommentLike"
});
db.commentlike.belongsTo(db.user, {
    foreignKey:"likeBy",
    as:"user"
});
db.comment.hasMany(db.commentlike, {
    foreignKey:"commentId",
    as:"commentLikes"
});
db.commentlike.belongsTo(db.comment, {
    foreignKey:"commentId",
    as:"comments"
});

//tweet likes
db.user.hasMany(db.tweetlike, {
    foreignKey: "likeBy",
    as: "userTweetLike"
});
db.tweetlike.belongsTo(db.user, {
    foreignKey:"likeBy",
    as:"user"
})
db.tweet.hasMany(db.tweetlike, {
    foreignKey:"tweetId",
    as:"likes"
});
db.tweetlike.belongsTo(db.tweet, {
    foreignKey:"tweetId",
    as:"tweets"
});

//playlist
db.user.hasMany(db.playlist, {
    foreignKey:"userId",
    as:"userPlaylist"
});
db.playlist.belongsTo(db.user, {
    foreignKey:"userId",
    as:"user"
});
db.playlist.hasMany(db.video, {
    foreignKey:"videoId",
    as:"video"
});
db.video.belongsTo(db.playlist, {
    foreignKey:"videoId",
    as:"videoPlaylist"
});

export default db;