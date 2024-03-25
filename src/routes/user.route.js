//making ALL user route here for their work

//imporing router here
import { Router } from "express";
import { registerUser } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'; //importing multer middleware 

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


//exporting this router as a default
export default router;
