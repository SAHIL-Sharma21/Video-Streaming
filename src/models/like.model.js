// making likes model for our app

import mongoose, { Schema } from "mongoose";


const likesSchema = new Schema(
    {
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comments"
        },
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "videos"
        },
        likedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        tweet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "tweets"
        }
    },
    { timestamps: true }
);



export const Like = mongoose.model("Like", likesSchema);