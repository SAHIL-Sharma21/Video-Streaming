//making playlist model for our app
import mongoose, { Schema } from "mongoose";



const playlistSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        videos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "videos"
            }
        ],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    },
    { timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);