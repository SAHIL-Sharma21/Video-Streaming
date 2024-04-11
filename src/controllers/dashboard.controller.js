
import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    //controller to get channel stats

    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401, "Youn are not authorized!");
    }

    //using aggregate pipeline to get the channel stats
    const channelStats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "owner",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" },
                totalSubscribers: { $sum: { $size: "$subscribers" } },
                totalLikes: { $sum: { $size: "$likes" } }
            }
        },
        {
            $project: {
                _id: 0,
                totalVideos: 1,
                totalViews: 1,
                totalSubscribers: 1,
                totalLikes: 1
            }
        }
    ]);

    //checking if  desired data we got or not
    if (!channelStats || channelStats.length === 0) {
        throw new ApiError(500, "no channel stats are found.")
    }


    return res
        .status(200)
        .json(new ApiResponse(200, channelStats[0], "Channel stats fetched successfully!"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    //getting channel videos

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "You are not authorized!");
    }

    //finding user all videos if he has upkloaded.
    // const channelVideo = await Video.aggregate([
    //     {
    //         $match: {
    //             owner: new mongoose.Types.ObjectId(userId),
    //         }
    //     },
    //     // {
    //     //     $group: {
    //     //         _id: null,
    //     //         totalVideos: { $sum: 1 }
    //     //     }
    //     // }
    // ]);

    //simple metjhod to get channel video
    //not taking createdAt, updatedAt and __v in output.
    const channelVideo = await Video.find({ owner: userId }).select(" -createdAt -updatedAt -__v");

    if (!channelVideo || channelVideo.length === 0) {
        throw new ApiError(400, "channel does not have any videos!");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, channelVideo, "Channel videos fetched successfully!"));
});

export {
    getChannelStats,
    getChannelVideos
}
