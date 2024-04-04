
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

    //parsing the page and limit
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    //checking if video id is there or not
    if (!videoId) {
        throw new ApiError(400, "video id is required.");
    }

    const videoComment = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId),
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "video",
                as: "comment"
            }
        },
        {
            $unwind: "$comment"
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "commentOwner"
            }
        },
        {
            $unwind: "$commentOwner"
        },
        {
            $group: {
                _id: "$_id",
                title: { $first: "$title" },
                description: { $first: "$description" },
                videoOwner: { $first: "$owner" },
                totalComments: { $sum: 1 }, // Calculate total comment count
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                totalComments: 1,
            }
        },
        {
            $skip: (parsedPage - 1) * parsedLimit,
        },
        {
            $limit: parsedLimit,
        }

    ]);

    // console.log(videoComment);
    // const allComments = await Comment.aggregatePaginate(videoComment, option);
    // console.log(allComments.docs);
    if (!videoComment) {
        throw new ApiError(400, "Error while getting total comment");
    }


    if (videoComment.length === 0) {
        throw new ApiError(401, "this video have zero comment");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, videoComment, "got all comment to the video!"))
});

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
    //writing controller to update a comment
    //taking updated/newcontent from the req.body
    const { newContent } = req.body;
    //take comment id from the params
    const { commentId } = req.params;

    //checking if comment id and newContent is provided or not;
    if (!newContent || !commentId) {
        throw new ApiError(401, "content and comment Id is required.");
    }

    //finding comment with its id and wil check the write owner of it and then he can modify/update the comment
    const userComment = await Comment.findById(commentId);

    //now checking
    if (userComment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(401, "You are not authorize to update the comment.");
    }

    //we will update the comment
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content: newContent,
            }
        },
        { new: true }
    );

    if (!updatedComment) {
        throw new ApiError(500, "Error while updating the comment.")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedComment, "Comment updated Successfully!"));
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    //deleting a comment
    //taking comment id from params
    const { commentId } = req.params;

    //if comment id is not given
    if (!commentId) {
        throw new ApiError(401, "Comment Id is required.");
    }

    //finding comment and its owner he can only delete the comment
    const userComment = await Comment.findById(commentId);

    //now we will check if user is true owner of it or not
    if (userComment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "you are not authorize to delete the comment")
    }

    //delete the comment
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
        throw new ApiError(500, "Error while deleting the comment.")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment deleted successfully!"));

})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
