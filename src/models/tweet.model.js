//tweets model in our app
import mongoose, { Schema } from "mongoose";


const tweetsSchema = new Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);


export const Tweet = mongoose.model("Tweet", tweetsSchema);