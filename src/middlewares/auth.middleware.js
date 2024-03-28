//making auth middleware for logging out the user
//it will only do if user is there or not

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Jwt from "jsonwebtoken";

//if res is not in used then we can put _ in place of that --> production grade application
export const verifyJWT = asyncHandler(async (req, _, next) => {

    try {
        //request has access to cookies due to middleware
        //mobile se cookie shayad n aaye to  kys pta custom header bej raha hai 
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", ""); //here we are doing if req.header(auth) is there then we have to replace Bearer keyword wtith empty string as we get Bearer <Access token> from the header
        console.log(token);

        //if token is not there then through error
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        //verifying token from the jwt if the token is correct or not 
        //this decodedToken is is a object which will contain user information
        const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        //id hme decodedToken se milegi kyki hmne usermodel mei generateAccessToken mei _id ek property diya hua hai.
        const user = await User.findById(decodedToken?._id).select(" -password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        //if user hai toh req mei naya object add kr denge
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }

});