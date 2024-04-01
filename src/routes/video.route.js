//making video router here
import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { uploadVideo } from '../controllers/video.controller.js';
import { upload } from '../middlewares/multer.middleware.js';


const videoRouter = Router();


videoRouter.route("/upload-video").post(verifyJWT, upload.fields(
    [
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "videoThumbnail",
            maxCount: 1
        }
    ]
), uploadVideo);


export default videoRouter;