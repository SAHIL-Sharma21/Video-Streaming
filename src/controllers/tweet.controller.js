//tweet controller 
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet


    //taking content from the body
    const { content } = req.body;
    // console.log(content);

    if (!content || (content.trim() === "" | undefined)) {
        throw new ApiError(401, "content field is required.");
    }

    //next step will be check if user is present who is going to tweet.
    // const user = await User.findOne(req.user?._id);
    if (!(isValidObjectId(req.user?._id))) {
        return new ApiError(401, "You can't tweet as you don't have permission");
    }

    //now creating an document if everythings goes well
    const tweetData = await Tweet.create({
        content,
        owner: req.user?._id
    });

    if (!tweetData) {
        throw new ApiError(401, "Error while creating tweet");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, tweetData, "Tweet created successfully!"));
});

const getUserTweet = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    //getting user tweet
    //taking userId from params
    const { userId } = req.params;

    //we can avoid this : will see in future.
    const user = await User.findOne({ _id: req.user?._id });

    if (user._id.toString() !== userId) {
        throw new ApiError(401, "we can't find you your id didn't match")
    }

    // getting user tweet
    const getUserTweet = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $addFields: {
                user: {
                    $arrayElemAt: ["$user", 0] //extracting the user field as it is array and taking its 0th index value which is our user object
                }
            }
        },
        {
            $project: {
                _id: 1,
                user: {
                    userName: 1,
                    fullname: 1,
                    avatar: 1
                },
                content: 1
            }
        }
    ]);

    if (!getUserTweet) {
        throw new ApiError(401, "Tweet associated with user didn't found!");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, getUserTweet[0], "User Tweet fetched successfully!"));
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
});

const deletetweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
});

export { createTweet, getUserTweet, updateTweet, deletetweet }