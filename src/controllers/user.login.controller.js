//writing user login controller
import { asyncHandler } from "../utils/asyncHandler"
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";


//making one method to generate access token and refresh token
//this userId we will get from the user which we have find from the DB
const accessAndRefreshTken = async (userId) => {
    try {
        const user = await User.findById(userId); //finding user from userId
        const accessToken = user.generateAccessToken();
        const refreshtoken = user.generateRefreshToken();

        //adding refresh token in our user database
        user.refreshtoken = refreshtoken;
        //if we save the value to db then  mongoose ke model bolenge ki password required to save so we are passing object in below method and setting to false
        await user.save({ validateBeforeSave: false }); //saving user as save is the mongoDb method --> DB operation then have to put await

        //returing refresh and access token
        return { accessToken, refreshtoken };

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
    if (!(userName || email)) {
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
    const { accessToken, refreshtoken } = await accessAndRefreshTken(user._id);

    const loggedInUser = await User.findById(user._id).select(" -password  -refreshtoken"); //password and refresh token field nhi chaiye

    //sedning cookie


});

export { loginUser };