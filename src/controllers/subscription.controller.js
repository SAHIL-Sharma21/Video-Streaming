
import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription

    if (!channelId) {
        throw new ApiError(400, "Channel ID is required.")
    }

    //we wil check if that user is a subscriber of that channel or not
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "Please login to perfoem subscription.")
    }

    //finding that user is subscribed to that channel or not 
    const subscriber = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    });

    if (!subscriber) {
        try { // if user didnot subscribed then we will subscribe him and making an database entry!
            const subscribingChannel = await Subscription.create({
                subscriber: userId,
                channel: channelId,
            });
            return res
                .status(201)
                .json(new ApiResponse(200, subscribingChannel, "User subscribed to channel successfully!"));
        } catch (error) {
            throw new ApiError(500, "Error while subscribing the channel.")
        }

    } else {
        try { //is user is already subscribed the we will unsubscribed him adn delte the entry from database.
            const removeSubscriber = await Subscription.findOneAndDelete({ subscriber: userId, channel: channelId });
            return res
                .status(201)
                .json(new ApiResponse(200, removeSubscriber, "Chanel unsubscribed successfully!"));
        } catch (error) {
            throw new ApiError(500, "Unable to unsubscibe the channel.");
        }
    }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(401, "Channel Id id required")
    }

    try {
        //usinf aggregation pipeline
        const userChannelSubs = await Subscription.aggregate([
            {
                $match: {
                    channel: new mongoose.Types.ObjectId(channelId),
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "subscriber",
                    foreignField: "_id",
                    as: "subscribers"
                }
            },
            {
                $unwind: "$subscribers"
            },
            {
                $project: {
                    channel: 1,
                    subscribers: {
                        userName: 1,
                        email: 1,
                        avatar: 1,
                        fullname: 1
                    }
                }
            }
        ]);

        if (!userChannelSubs || userChannelSubs.length === 0) {
            throw new ApiError(400, "No subscribers were found");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, userChannelSubs[0], "User channel subscribers successfully!"));
    } catch (error) {
        throw new ApiError(500, "Error while fetching subscribers")
    }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    //controller to write subscribed for channel.

    if (!subscriberId) {
        throw new ApiError(400, "subscriber id is required");
    }

    try {
        const subscribedChannel = await Subscription.aggregate([
            {
                $match: {
                    subscriber: new mongoose.Types.ObjectId(subscriberId),
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "channel",
                    foreignField: "_id",
                    as: "subscribedChannel"
                }
            },
            {
                $unwind: "$subscribedChannel"
            },
            {
                $project: {
                    subscriber: 1,
                    channel: 1,
                    subscribedChannel: {
                        userName: 1,
                        email: 1,
                        avatar: 1,
                    }
                }
            }
        ]);

        if (!subscribedChannel || subscribedChannel.length === 0) {
            throw new ApiError(400, "Channle did not subscribed to any other channel.")
        }

        return res
            .status(200)
            .json(new ApiResponse(200, subscribedChannel, "Subscribed channel fetched successfully!"));
    } catch (error) {
        throw new ApiError(500, "Error while getting subscribed Channel.")
    }
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
