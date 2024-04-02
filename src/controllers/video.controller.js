//makiong  video controller here
import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js"
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js'
import { deletedOnCloudinary, uploadOnCloudinary } from '../utils/cloudnaryService.js'



const getAllVideos = asyncHandler(async (req, res) => {

});

const publishVideo = asyncHandler(async (req, res) => {
    //publish a video
    const { title, description } = req.body;
    const userId = req.user?._id;
    let views = 0;
    let isPublished = true;


    if (!(title && description)) {
        throw new ApiError(400, "title and description are required");
    }

    //taking file path
    const videoFileLocalPath = req.files?.videoFile[0].path;
    const thumbnailLocalpath = req.files?.thumbnail[0].path;
    // console.log(req.files?.thumbnail);

    if (!videoFileLocalPath && !thumbnailLocalpath) {
        throw new ApiError(401, "video file and thumbnail are required.");
    }

    // await deletedOnCloudinary(videoFile?.url);
    // await deletedOnCloudinary(thumbnail?.url);

    //here we get the video and now we will upload on cloudinary
    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalpath);

    if (!videoFile || !thumbnail) {
        throw new ApiError(400, "video and thumbnail are required.")
    }

    const video = await Video.create({
        videoFile: videoFile?.url,
        thumbnail: thumbnail.url,
        owner: userId,
        title,
        description,
        duration: videoFile?.duration,
        views,
        isPublished,
    });

    if (!video) {
        throw new ApiError(500, "error while creating entry in database.")
    }

    return res
        .status(201)
        .json(new ApiResponse(200, video, "video Published successfully."));
});

const getVideoById = asyncHandler(async (req, res) => {
    //getting video by videoID
    const { videoId } = req.params;

    //check videoId is ther or not
    // if (!req.params?.videoId) {
    //     throw new ApiError(401, "video id notfound");
    // }
    if (!videoId) {
        throw new ApiError(401, "videoId is required");
    }

    const getVideo = await Video.findById(videoId).select(" -duration -isPublished ");
    // console.log(getVideo);

    return res.status(200).json(new ApiResponse(200, getVideo, "get the video by ID"));

});

const updateVideo = asyncHandler(async (req, res) => {

});

const deleteVideo = asyncHandler(async (req, res) => {

});

const togglePublishStatus = asyncHandler(async (req, res) => {

});


export { getAllVideos, publishVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus };