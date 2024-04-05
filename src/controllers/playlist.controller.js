
import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    //TODO: create playlist
    //creating playlist fro the loggedIn user

    if (!name || !description) {
        throw new ApiError(400, "Playlist name and description is required");
    }

    //creating playlist
    const createdPlaylist = await Playlist.create({
        name,
        description,
        videos: [],
        owner: req.user?._id,
    });

    if (!createdPlaylist) {
        throw new ApiError(500, "Error while creating a playlist.");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, createdPlaylist, "Playlist created successfully!"));
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists
    //getting user playlist from its userId which is getting us from params
    if (!userId) {
        throw new ApiError(400, "User Id is required to get the playlist");
    }

    //finding the user amd then we will lookup to his playlist and count the total playlist he have
    const userPlaylist = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
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
            $group: {
                _id: "$owner",
                totalPlaylist: { $sum: 1 },
                playlist: { $push: "$$ROOT" }, //push the playlist into an array
                user: {
                    $first: {
                        $arrayElemAt: ["$user", 0]//get the user detail
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                totalPlaylist: 1,
                user: {
                    userName: 1,
                    fullname: 1,
                    avatar: 1
                },
                // playlist: 1
            }
        }
    ]);

    if (!userPlaylist || userPlaylist.length === 0) {
        throw new ApiError(400, "user doesn't have the playlist.")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, userPlaylist[0], "user playlist fetched successfully."));
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
