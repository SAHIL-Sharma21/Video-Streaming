//making ALL user route here for their work

//imporing router here
import { Router } from "express";
import { registerUser } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'; //importing multer middleware 
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, updateAccountDetails, updateAvatar, updateCoverImage } from '../controllers/user.login.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getUserChannelProfile, getWatchHistory } from "../controllers/user.aggregate.controller.js";

const router = Router();

//we have to use multer middleware to upload file before registering the user
router.route("/register").post(
    upload.fields([
        //taking 2 files avatar and coverImage
        {
            name: "avatar",
            maxCount: 1, //maxCount means how much file needed
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser); //register a user route
// router.route("/login").post();//login a user

router.route("/login").post(loginUser);

//secured route --> using custom middleware
router.route("/logout").post(verifyJWT, logoutUser);
//route to refresh a access token and refresh token
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
//get currentuser
router.route("/current-user").get(verifyJWT, getCurrentUser);
//update account details
//patch use krna padega wrna poorqa field hi change kr dega agr hm post use krenge toh
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
//avatar update
//patch uise krna padega -->> only ek avatar update kr rahe hia
//using multer middleware to upload single file 
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar);
//making update coverImage route
router.route("/cover-image").patch(verifyJWT, upload.single("/coverImage"), updateCoverImage);

//using params to get username for making route for getinguserProfile
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
//getting watch history
router.route("/history").get(verifyJWT, getWatchHistory);

//exporting this router as a default
export default router;
