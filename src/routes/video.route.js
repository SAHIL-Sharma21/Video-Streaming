//making video router here
import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { deleteVideo, getAllVideos, getVideoById, publishVideo, togglePublishStatus, updateVideo } from '../controllers/video.controller.js';
import { upload } from '../middlewares/multer.middleware.js';


const videoRouter = Router();

videoRouter.use(verifyJWT); //this middleware will apply to all routes -->> that we are using router.use

videoRouter.route("/").get(getAllVideos)
    .post(upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]), publishVideo);


videoRouter.route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

videoRouter.route("/toggle/publish/:videoId").patch(togglePublishStatus);


export default videoRouter;