import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle like on video

    //functionality for toggling video like
    if (!videoId) {
        throw new ApiError(401, "Video ID is required!");
    }

    const userId = req.user?._id;
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "You are not authorized!");
    }

    //finding video by videoID given by user in params
    const video = await Video.findById(videoId);


    if (!video || video.isPublished !== true) {
        throw new ApiError(400, "Video did not found!");
    }
    //check if user has already liked it or not
    const likedVideo = await Like.findOne({
        video: videoId,
        likedBy: userId,
    });

    if (!likedVideo) {
        try {
            //if video like is not there thwn we wil like the video
            const likedToggleVideo = await Like.create({
                video: videoId,
                likedBy: userId,
            });

            return res
                .status(201)
                .json(new ApiResponse(200, likedToggleVideo, "Lked the video!"));
        } catch (error) {
            throw new ApiError(500, "Error while liking the")
        }
    } else {
        try {
            //if there is already liked on video then  we will dislike the video
            const disliketoggleVideo = await Like.findOneAndDelete({
                video: videoId,
                likedBy: userId
            });

            return res
                .status(201)
                .json(new ApiResponse(200, disliketoggleVideo, "Disliked the video!"));
        } catch (error) {
            throw new ApiError(500, "Error while disliking the video!")
        }
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment

    //controller for toggle comment
    if (!commentId) {
        throw new ApiError(401, "Comment Id is required!");
    }

    if (!isValidObjectId(req.user?._id)) {
        throw new ApiError(401, "You are not authorize.")
    }
    console.log("exe is here");

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}