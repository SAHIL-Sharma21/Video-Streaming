//tweet controller 
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const createTweet = asyncHandler(async (req, res) => {

});

const getUserTweet = asyncHandler(async (req, res) => {

});

const updateTweet = asyncHandler(async (req, res) => {

});

const deletetweet = asyncHandler(async (req, res) => {

});

export { createTweet, getUserTweet, updateTweet, deletetweet }