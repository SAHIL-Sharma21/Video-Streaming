
import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"


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

    //writing contoller to add video to a playlist
    //checking if there is playlistId and video id is provided

    if (!playlistId || !videoId) {
        throw new ApiError(400, "Playlist Id and VideoId is required to add video to playlist");
    }

    const playlist = await Playlist.findById(playlistId);
    //finding video also by its id
    const video = await Video.findById(videoId);

    //checking if the user is the right owner of it or not
    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You are not authorize to add a video to a playlist");
    }

    //also checkingif video is published or not.
    if (video?.isPublished !== true) {
        throw new ApiError(400, "Video is unPublished you canot add into your playlist.")
    }

    //if videoid is already exist in that array then we cannot add
    if (playlist?.videos.includes(videoId)) {
        throw new ApiError(400, "video already exisits.");
    }
    // const addedVideoToPlaylist = await Playlist.updateOne(
    //     {
    //         _id: new mongoose.Types.ObjectId(playlistId),
    //     },
    //     {
    //         $push: {
    //             videos: videoId,
    //         }
    //     }
    // );
    const addedVideoToPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push: {
                videos: videoId,
            }
        },
        { new: true }
    );

    //above both code is correct can use any apprach
    if (!addedVideoToPlaylist) {
        throw new ApiError(500, "Error while adding video to playlist.")
    };

    return res
        .status(200)
        .json(new ApiResponse(200, addedVideoToPlaylist, "Video added to playlist successfully!"));

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist
    //removind the video from the playlist
    //checking the playlistId and videoId is provided.

    if (!playlistId || !videoId) {
        throw new ApiError(400, "Playlist Id and video ID is requried.");
    }

    console.log("exe is here");


})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
    //deleting the todo
    //checking if playlist id is present or not

    if (!playlistId) {
        throw new ApiError(400, "playlist id is required to delete the playlist.")
    }

    //findind playlist by its id
    const playlist = await Playlist.findById(playlistId);

    //checking the owner and playlist of the same user
    if (!isValidObjectId(req.user?._id)) {
        throw new ApiError(400, "user id is not correct.")
    }

    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You are not authorized to delete the playlist");
    }
    //here we get the same user
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId, { new: true });

    if (!deletedPlaylist) {
        throw new ApiError(500, "Error while deleting the playlist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "playlist deleted successfully!"));
});

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

    if (!isValidObjectId(req.user?._id)) {
        throw new ApiError(400, "user id is not correct.")
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
