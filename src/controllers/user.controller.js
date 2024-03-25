//we are here writing controller for registering user 

import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'

//making method to register user
const registerUser = asyncHandler(async (req, res) => {
    //Algorithim and steps to register user on our backend
    // --> Get user details from frontend
    // --> Validation - (checks if all the field is not empty || validation)
    // --> check if user already existe (check with userName and email uniqueness)
    // --> Check for Images, Checks for avatar
    // --> upload them to cloudinary --- (make sure that avataar is uploaded)
    // --> Create User Object - create entry in DB
    // --> remove password and secret key/ refresh Token field from the response
    // --> Check for user creation
    // --> return password (if true) otherwise error

    //taking user details from the request parameter
    //destructing the userDetails
    //hmlog bs data handle kr skte hai idhr file handle nhi kr skte
    const { userName, email, fullName, password } = req.body; //we are getting the reponse and data
    console.log("email: ", email);

    //now we check for the validation --> but this is how begginer will do
    // if (fullName === "") {
    //     //if fullName filed is empty throw error
    //     throw new ApiError(400, "fullName is required");
    // }
    //how professional write if condition on all the fields to check if the field is emoty or not
    if (
        [fullName, userName, email, password].some((field) => field?.trim() === "") //saari filed trim krne ke baad agr woh empty hai to teru
    ) {
        throw new ApiError(400, "All fields are required")
    }

    //now we are checking if the user already exist or not so we will ask from User model 
    //below we are asking form the user model which is build by mongoose which is taking to our database and it will return wheter user is already existed
    const existedUser = User.findOne({
        //for checking userName and email this is or query
        $or: [{ userName }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User already exist.");
    }


});

export { registerUser };
