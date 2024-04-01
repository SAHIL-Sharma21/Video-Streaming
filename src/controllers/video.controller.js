//makiong  video controller here
import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js"
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudnaryService.js'



const getAllVideos = asyncHandler(async (req, res) => {

});

const publishVideo = asyncHandler(async (req, res) => {

});

const getVideoById = asyncHandler(async (req, res) => {

});

const updateVideo = asyncHandler(async (req, res) => {

});

const deleteVideo = asyncHandler(async (req, res) => {

});

const togglePublishStatus = asyncHandler(async (req, res) => {

});


export { getAllVideos, publishVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus };