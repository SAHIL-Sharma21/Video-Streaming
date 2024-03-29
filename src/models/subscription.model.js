//making subscriptio model here
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        subscriber: {
            type: mongoose.Schema.Types.ObjectId, //the user who is subscribing
            ref: "User"
        },
        channel: {
            type: mongoose.Schema.Types.ObjectId, // the user (subscriber) is subscribing to this user which is chanel
            ref: "User"
        }
    },
    { timestamps: true }
);


export const Subscription = mongoose.model("Subscription", subscriptionSchema);