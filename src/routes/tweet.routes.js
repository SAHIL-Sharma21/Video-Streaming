//making tweet route
import { Router } from 'express';
import {
    createTweet,
    deletetweet,
    getUserTweet,
    updateTweet,
} from "../controllers/tweet.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();
//router.use is a middleware and passing verifyJWT token and in req obj we are assigning user
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweet);
router.route("/:tweetId").patch(updateTweet).delete(deletetweet);

export default router