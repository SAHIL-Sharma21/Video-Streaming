//making video model here in this model file
import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; //importing mongoose aggregate paginate its just like a plugin.

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, // cloudnary url
            required: true,
        },
        thumnail: {
            type: String, // cloudnary url
            required: true,
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        view: {
            type: Number,
            default: 0 //giving default 0 to views
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }, { timestamps: true });

//we can write our own plugin >> this aggregation is used to write complex querries
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model('Video', videoSchema);