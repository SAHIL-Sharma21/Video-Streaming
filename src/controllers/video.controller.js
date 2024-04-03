//makiong  video controller here
import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js"
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js'
import { deletedOnCloudinary, uploadOnCloudinary } from '../utils/cloudnaryService.js'



const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
});

const publishVideo = asyncHandler(async (req, res) => {
    //publish a video
    const { title, description } = req.body;
    const userId = req.user?._id;



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

    // const getVideo = await Video.findById(videoId).select(" -duration -isPublished ");
    const getVideo = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "user"
            },
        },
        {
            $addFields: {
                user: {
                    $first: "$user" //it will add user field as user is our array and return 0th index of user array.
                }
            }
        },
        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
                user: {
                    userName: 1,
                    fullname: 1,
                    avatar: 1
                },
                title: 1
            }
        }
    ]);

    //checkking if video not found related to that owner
    if (getVideo.length === 0) {
        throw new ApiError(401, "No video is there for this user.")
    }
    // console.log(getVideo);

    return res.status(200).json(new ApiResponse(200, getVideo, "get the video by ID"));

});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    //checking for the particular user -> he is owner of the video
    if (!videoId || !isValidObjectId(req.user?._id)) {
        throw new ApiError(400, "You dont have permission to update a video");
    }
    // console.log(videoId);
    // console.log(isValidObjectId(req.user?._id));
    const { title, description } = req.body;
    if (!title || !description) throw new ApiError(400, "title and description are required to update.");



    //checking new thumbnail file is ther
    const newThumbnaiLocalPath = req.file?.path;
    if (!newThumbnaiLocalPath) return new ApiError(401, "thumbnail image is required.")

    //TODO: for deleteoncloudinary use db.findone method
    //deleting old thumbnail inmage on cloudinary.
    const oldVideo = await Video.findOne({ _id: videoId });
    // console.log(oldVideo);
    if (!oldVideo.thumbnail) return null;
    const result = await deletedOnCloudinary(oldVideo?.thumbnail);
    // console.log(result);


    //upload on cloudinary
    const newThumbnail = await uploadOnCloudinary(newThumbnaiLocalPath);
    // console.log(newThumbnail);
    // const findVideo = await Video.findById(videoId);
    // console.log(findVideo);
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail: newThumbnail?.url
            }
        },
        { new: true }
    ).select(" -videoFile -duration -view -createdAt -updatedAt -__v");

    if (!updateVideo) return new ApiError(400, "Erroe while updating video");
    // console.log(updatedVideo);

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video updated successully"))
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //deleting a video
    //checking if that owner is right/legitimate who is deleting the video
    if (!videoId || !isValidObjectId(req.user?._id)) return new ApiError(400, "You dont have permission to delte this video")

    const deletedVideo = await Video.findByIdAndDelete(videoId, { new: true });

    if (!deleteVideo) return new ApiError(400, "Error while deleting a video");

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video deleted successfully!"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //todo: toggle publish
    //checking user and video id matched
    if (!videoId && !isValidObjectId(req.user?._id)) return new ApiError(401, "you dont have pwermission to toggle the video");
    // console.log("execution is here.");

    const pipeline = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $addFields: {
                isPublished: {
                    $not: "$isPublished"
                }
            }
        }
    ]);

    //checking 
    const isPublished = pipeline.length !== 0 ? pipeline[0].isPublished : null;

    const togglePublishStatus = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: isPublished,
            }
        },
        { new: true }
    ).select(" -createdAt -updatedAt -duration -videoFile -description")

    // console.log(toggleStatus[0].isPublished);
    if (!togglePublishStatus) return new ApiError(400, "Video status did not changed.");

    return res
        .status(200)
        .json(new ApiResponse(200, togglePublishStatus, "Video status toggled successfully!"));

});


export { getAllVideos, publishVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus };