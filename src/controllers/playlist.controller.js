
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

    //controller for getting the playlist by the playlist id
    if (!playlistId) {
        throw new ApiError(400, "Playlist id is required");
    }

    //finding the playlist by its id
    const playlistById = await Playlist.findById(playlistId).select(" -createdAt -updatedAt");

    if (!playlistById) {
        throw new ApiError(400, "Playlist is not there with the given Playlist Id.")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlistById, "Playlist fetched successfully!"));
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
    //updating a playlist with the correct owner
    if (!playlistId) {
        throw new ApiError(400, "playlist id is required.")
    }

    if (!name || !description) {
        throw new ApiError(400, "name and description is required to update the playlist.");
    }

    //finding the playlist but its id
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(400, "Can't find the playlist with the given playlist id");
    }

    //if playlist id in db and user provided playlist id does not match then throw error.
    if (playlist?._id.toString() !== playlistId) {
        throw new ApiError(400, "playlistId is invalid");
    }
    //checking the playlist owner if he is the right owner then he can edit the playlist
    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You are not authorize to update this playlist.")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description,
            }
        },
        { new: true }
    );

    if (!updatedPlaylist) {
        throw new ApiError(500, "Error while updating the playlist.")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfuly."));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
