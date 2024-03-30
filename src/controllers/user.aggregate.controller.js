//here i am going to write agregation pipeline for getting subscriber and channel details and we will join the 2 table

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from '../models/user.model.js'

const getUserChannelProfile = asyncHandler(async (req, res) => {

    //first we will get the data from req.params >> as we go to channel and it will show in url 
    const { userName } = req.params;
    //if userName is not present in params then we will run this block
    if (!userName?.trim()) {
        throw new ApiError(400, "username is empty");
    }

    //now hm log user ko find kr lenge userName se where clause lgga ke
    // await User.find({userName});//yeh bhi kr skte hai pr isse database call zada ho jayegi

    //now we are writing aggregation pipeline
    //aggregation pipeline ka output arrays aata hai >> so we have to handle array
    const channel = await User.aggregate([

        //find the user in 1st pipeline
        { //this will match the userName and return the name
            $match: userName?.toLoweCase() //checking username is there and usko lowercase mei kr de rahe hai.
        }, // hmare pass abhi 1 document hai after putting match operator.
        //2nd pipeline mei uske subscribers kitne ke channel ke through
        { //first pipeline >> from subscriptions to localfield to _id and forigen field channel ko chipka denge.
            $lookup: { //in below pipeline we are geting subscribers from channel > as mere subscribers
                from: "subscriptions",//subscription model se milega hme from >>lekin db mei sb lowercase mei ho jata hai and prural ho jata hai
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        // count krra meine kitno ko subscribed kr rakh hai subscriber ke through
        { //now i want whom i have subscribed to and writing below pipeline
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        //3rd pipeline mein hmne original user mei 2 field aut add krdi addfiled ke through
        { //now we will add these 2 document to our main document >> purane filed rahenge pr yeh new bhi add ho jayenge
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers" //this subscribers have $ sign as now it is field and we have to write $in front of it   
                },
                chanelSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: { //writing if the user has subscribed or not , so we are writing condition 
                    $cond: { //this cond has 3 parametr ->> if, then (agr true hai toh yeh krdo) or else (agr false hai toh yeh krdo)
                        if: { $in: [req.users?._id, "$subscribers.subscriber"] }, //checking if mei(user usee channel ka subscriber hu ya nhi) >> this $in can found in array and object
                        then: true,
                        else: false
                    }
                }
            }
        },
        //last pipeline >> saari values nhi denge sb selected cheze hi project krunga
        {
            $project: { //just giving 1 as a flag jo value hme project karani hai.
                fullname: 1,
                userNmae: 1,
                subscribersCount: 1,
                chanelSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ]);

    console.log(channel);

    //now if we did not getthe user then we will retun error res
    if (!channel?.length) {
        throw ApiError(400, "Channel dose not exist.")
    }

    //agr channel hai to return kdro response
    return res
        .status(200)
        .json(new ApiResponse(200, channel[0], "User channel fetched sucesfully."))

});

export { getUserChannelProfile };