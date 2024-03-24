//we are here writing controller for registering user 

import { asyncHandler } from '../utils/asyncHandler.js'



//making method to register user
const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "User Registered"
    })
});

export { registerUser };
