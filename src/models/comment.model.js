//comments model

import mongoose, { Schema } from "mongoose";


const commentsSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "videos",
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    },
    { timestamps: true }
);


export const Comment = mongoose.model("Comment", commentsSchema);