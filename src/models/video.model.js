//making video model here in this model file
import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema({}, { timestamps: true });


export const Video = mongoose.model('Video', videoSchema);