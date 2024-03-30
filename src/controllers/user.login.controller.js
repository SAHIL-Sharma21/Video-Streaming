//writing user login controller
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { uploadOnCloudinary } from '../utils/cloudnaryService.js'
import { deleteOldAvatarImage } from '../utils/deleteOldAvatarImage.js';

//making one method to generate access token and refresh token
//this userId we will get from the user which we have find from the DB
const accessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId); //finding user from userId
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        //adding refresh token in our user database
        user.refreshToken = refreshToken;
        //if we save the value to db then  mongoose ke model bolenge ki password required to save so we are passing object in below method and setting to false
        await user.save({ validateBeforeSave: false }); //saving user as save is the mongoDb method --> DB operation then have to put await

        //returing refresh and access token
        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "something went wrong while creating access and refresh token");
    }
}



const loginUser = asyncHandler(async (req, res) => {
    //writing alogo for loggin a user
    // --> get user data from req boy
    // --> validate the if data is there or not
    // --> check ig user is registered if registerd the he con login
    // -> compare the user data with db store user data or can compare access token
    // --> response success

    //what hitesh sir wrote
    // --> get user data -> req.body
    // --> username or email (present or not)
    // --> find the user
    // --> password check
    // --> generate acces token and refresh token
    // --> send secure cookie
    // --> response success



    //taking data from body task 1
    const { userName, email, password } = req.body;

    //if userName and email is not then we will throuh error
    if (!userName && !email) {
        throw new ApiError(400, "Email or userName is required");
    }

    //now if there is data then we will find user in Db
    //this findOne method find the user based on userName or email
    const user = await User.findOne({
        $or: [{ userName }, { email }],
    });

    //if user mila hi nhi toh user exist hi nhi krta db mei
    if (!user) {
        throw new ApiError(404, "user does not exist");
    }

    //checking for password
    //the methods we have made in User model is avaivalbe in our find user not in User as user is instance of that
    const isPasswordValid = await user.isPasswordCorrect(password); //retun true or false

    //if password is not correct then will error
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    //now generating access and refresh token
    //calling method to generate token
    const { accessToken, refreshToken } = await accessAndRefreshToken(user._id);

    //below varibale we are sending as response to user as loggedInUser is a object
    const loggedInUser = await User.findById(user._id).select(" -password  -refreshToken"); //password and refresh token field nhi chaiye

    //sedning cookie --> desigining cookies
    const options = {
        //by default isse koi bhi cookie ko modify kr skta hai frontend pr pr yeh dono option true krne pr sirf server pr modify kr skte hai
        httpOnly: true,
        secure: true
    }

    //returing method
    //jitni cookies bejna hai bej skte hai.
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: refreshToken, loggedInUser, accessToken
                },
                "user logged in successfully"
            )
        )
});

//making functionality for logging out user
const logoutUser = asyncHandler(async (req, res) => {
    //logging out User 
    // --> cookies clear
    // --> reset the refresh token

    //we will make our own middleware for auth middleware
    //we have use the middleware and verify the jwt and added user to req then we have th user obj in out req
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined,
            }
        },
        {
            new: true
        }
    )

    //options for cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user Logged out"))

    // return res
    //     .status(200)
    //     .removeHeader("accessToken")
    //     .removeHeader("refreshToken")
    //     .json(new ApiResponse(200, {}, "user Logged out."))
});

//making new endpoint where user can refresh/generate new accessToken and refresh token
const refreshAccessToken = asyncHandler(async (req, res) => {
    //client will have refresh Token and we will get that refresh token from cookies
    //we will refreshToken from cookies or someone is using mobile then it wil come from body.
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    //if refreshToken is not there 
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request");
    }

    try {
        //if there is token then we will verify
        //we always need decodedToken when we verfify the user
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        //we alwyas need decoded token then it will decode the information and it will contains user Object which is stored in DB
        //we are making DB query to find user by decodetoken and it will contain _id
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        //now we will check the user refrehToken which is stored in DB and incomingRefereshToken then we will give access 
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is expired or used");
        }

        //now all verification done then we will generate new token
        //making option
        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await accessAndRefreshToken(user._id);

        //sending response
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access Token Refreshed."
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token.")
    }
});


//writing logic for change current password
const changeCurrentPassword = asyncHandler(async (req, res) => {

    //we will take old password and new password from the body
    const { oldPassword, newPassword, confirmPassword } = req.body;

    //agr user password change kr paa raha hai toh woh logged in hoga >>> hmne auth middleware banya tha jimse req mei user hai waha se hm user ki id nikal lenge
    //    req.user?.id //isse current user ki id nikl jayegi
    // console.log(oldPassword);
    //finding user
    const user = await User.findById(req.user?._id);
    // console.log(user)
    //we are checking that old password is correct to verify the user
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword); //it will true or false
    console.log(isPasswordCorrect);
    //if password corrct nhi hai toh throw kedo error.
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password.")
    }

    //if we need one extra field to confirm password.
    // if (newPassword !== confirmPassword) {
    //     throw new ApiError(400, "Enter the same passwword.")
    // }

    //ab agr password true hai old password and now we assign new paswword to user model in db
    user.password = newPassword; //here we have only set the pass word not save it our db
    await user.save({ validateBeforeSave: false }); //here we are saving the new password in Db.

    //retun the response
    return res.status(200).json(new ApiResponse(200, {}, "Password Chnaged Successfuly!"))

});

//get current user
const getCurrentUser = asyncHandler(async (req, res) => {
    // const user = await User.findById(req.user?._id);

    if (!(req.user?._id)) {
        throw new ApiError(400, "Invalid user.")
    }

    return res.status(200).json(new ApiResponse(200, req.user, "Get the user."))

    //this is what hitesh sir wrote
    // return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched successfully."))
});

//making  update acount details  for the user
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body;

    if (!fullname || !email) {
        throw new ApiError(400, "All fields are required.")
    }

    //finding user to update their fullname and email
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { //mongodb operator to set.
                fullname,
                email: email
            }
        },
        { new: true } //update hone ke baad new user obj return kr deta hai
    ).select(" -password"); //password nhi bejenge bs wohi -passwprd kr diye

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated succesfully."))
});

//controler for updating avatar we will be usingmulter middleware to upload the file.
const updateAvatar = asyncHandler(async (req, res) => {
    //logic for uploading avatar
    //avvatar can only be updated if the user is loged in
    //taking local path from the multer middleware we got the access of file from it
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar file is missing.")
    }

    const newAvatar = await uploadOnCloudinary(avatarLocalPath);

    if (!newAvatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
    }

    //toDo: delete old avatar image.
    // const oldAvatarImage = req.user?.avatarImage;
    deleteOldAvatarImage(req.user?._id);

    //now we find the user and update the object
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: newAvatar.url,
            }
        },
        { new: true }
    ).select(" -password");

    //retur the reponse
    return res
        .status(200)
        .json(new ApiResponse(200, user, "avatar image updated successfully."));
});


//todo: make function of update coverImage 
const updateCoverImage = asyncHandler(async (req, res) => {
    //logic for updatingthe coverImage
    //getting the path from req.file

    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new ApiError(400, "CoverImage is missing.")
    }

    //if we get the local file path through multer
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading cover Image.")
    }

    //now will find the user and update the cover image for that user.
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url,
            }
        },
        { new: true }
    ).select(" -password");

    //sending response
    return res
        .status(200)
        .json(new ApiResponse(200, user, "Cover Imaage updated successfully."))
});



export { loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateAvatar, updateCoverImage };