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

    //checking if the commentis already liked or not
    const commentLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id,
    });

    //cheking if comment like is already present or not if present then we wil create the like otherwise dislike the comment
    if (!commentLike) {
        try {
            //if comment like is not there then will create the comment like
            const commentLiked = await Like.create({
                comment: commentId,
                likedBy: req.user?._id
            });

            return res
                .status(201)
                .json(new ApiResponse(200, commentLiked, "Comment liked Successfully!"));
        } catch (error) {
            throw new ApiError(500, "Error while liking the comment!")
        }
    } else {
        //if commentlike is already there then we will delte the existinglike.
        try {
            //if comment is already liked then we will dislike it making delete in database entry.
            const dislikedComment = await Like.findOneAndDelete({
                comment: commentId,
                likedBy: req.user?._id
            });
            return res
                .status(201)
                .json(new ApiResponse(200, dislikedComment, "Comment disliked successfully!"));
        } catch (error) {
            throw new ApiError(500, "Error while disliking the comment.")
        }
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet

    //toggling tweet like if like is not there then we will cretae one tweet like otherwise dislike it

    if (!tweetId) {
        throw new ApiError(401, "tweet Id is required!");
    }

    //checking for the user
    if (!isValidObjectId(req.user?._id)) {
        throw new ApiError(401, "You are not authorized!");
    }

    //find the tweet lke if its already present then will dislike otherwise will cfreate the like
    const tweetLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    });

    if (!tweetLike) {
        try {
            //if tweet like is not there then will create the new like
            const tweetLiked = await Like.create({
                tweet: tweetId,
                likedBy: req.user?._id
            });
            return res
                .status(201)
                .json(new ApiResponse(200, tweetLiked, "Tweet liked successfully!"));
        } catch (error) {
            throw new ApiError(500, "Error while liking the tweet!");
        }
    } else {
        try {
            //if tweet is already liked then will delete the tweet like.
            const dislikeTweet = await Like.findOneAndDelete({
                tweet: tweetId,
                likedBy: req.user?._id
            });

            return res
                .status(201)
                .json(new ApiResponse(200, dislikeTweet, "Disliked the tweet successfully!"));
        } catch (error) {
            throw new ApiError(500, "Error while disliking the tweet!");
        }
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    //controller for getting all liked videos by users.

    if (!isValidObjectId(req.user?._id)) {
        throw new ApiError(401, "You are not authorized!");
    }

    const likedVideo = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "VideoDetails",
            }
        },
        {
            $unwind: "$VideoDetails"
        },
        {
            $lookup: {
                from: "users",
                localField: "VideoDetails.owner",
                foreignField: "_id",
                as: "videoOwner"
            }
        },
        {
            $unwind: "$videoOwner"
        },
        {
            $project: {
                likedBy: 1,
                VideoDetails: {
                    videoFile: 1,
                    title: 1,
                    thumbnail: 1
                },
                videoOwner: {
                    username: 1,
                    fullname: 1,
                    avatar: 1
                }
            }
        },
    ]);

    if (!likedVideo || likedVideo.length === 0) {
        throw new ApiError(400, "No liked video found.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, likedVideo, "Liked video fetched successfully!"))

});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}