//making user models here now we are making structure of our model in which our data is stored in databses
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true //for searching field in DB
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, //cloudnary url
            required: true
        },
        coverImage: {
            type: String //cloudnary url
        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password field required']
        },
        refreshToken: {
            type: String,
        }
    }, { timestamps: true }); //createdAt and updatedAt will be get by the timpestamps in 2nd object


export const User = mongoose.model('User', userSchema);