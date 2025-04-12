 const userPayload = [
    "email",
     "userName",
    "password",
    "isLoggedIn",
    "role",
    "coverImage",
    "refreshToken",
    "createdAt",
    "updatedAt",
];
const videoPayload = [
    "videoOwner",
    "videoFile",
    "thumbnail",
    "description",
    "views",
    "isPublished",
    "createdAt",
    "updatedAt",
];
const hideVideoData = [
    "updatedAt",
    "videoOwner",
    "description",
    "isPublished",
];
 const hideCommentData = [
     "updatedAt",
     "ownerId",
     "videoId"
 ];

 const hideCommentLikeData = [
     "likeBy",
     "commentId",
     "updatedAt",
 ]

const hideVideoLikeData = [
    "videoId",
    "likeBy",
    "updatedAt",
     "createdAt",
]
export {
    userPayload,

    //video
    videoPayload,
    hideVideoData,
    hideVideoLikeData,

    //comment
    hideCommentData,
    hideCommentLikeData,
}
