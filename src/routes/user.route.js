//making ALL user route here for their work

//imporing router here
import { Router } from "express";
import { registerUser } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'; //importing multer middleware 
import { loginUser, logoutUser, refreshAccessToken } from '../controllers/user.login.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js"

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







//exporting this router as a default
export default router;
