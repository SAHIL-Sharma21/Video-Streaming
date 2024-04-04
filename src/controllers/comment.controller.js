
import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    //adding comment in our db
    const { content } = req.body;
    //taking video Id from params
    const { videoId } = req.params;

    if (!content || !videoId) {
        throw new ApiError(400, "Content and video id is required to comment.")
    }

    //finding video by video id
    const userVideo = await Video.findById(videoId);
    // console.log(userVideo);

    //checking if video is present by its id and video have to be published for user to comment
    if (!userVideo || userVideo.isPublished !== true) {
        throw new ApiError(401, "video not found");
    }

    const addedComment = await Comment.create({
        content,
        video: userVideo?._id,
        owner: req.user?._id
    });

    if (!addedComment) {
        throw new ApiError(400, "Error while adding comment");
    }

    //sending reposne to client
    return res
        .status(201)
        .json(new ApiResponse(200, addedComment, "comment added to video succesfully!"));
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
