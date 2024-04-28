//writing express code
import express from 'express';
import cookieParser from 'cookie-parser'; //importing cookieparser here 
import cors from 'cors'; //importing cors 


const app = express();

//using cors here using middleares >> and we are configuring cors by passing object to it and giving it origin in .env CORS_ORIGN=* is allowing request from anywhere which is not a god practice.
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

//accpeting json into our server and implementing using middleware from express.json
app.use(express.json({ limit: "20kb" })); //giving limit to 20kb to  accpet json in our app 

//configuration to our app for taking value from the params we going to use urlencoded
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

//for storing /serving static file we have to use static into our middlewares
app.use(express.static("public"));

//using cookie parser
app.use(cookieParser());



//writing our routes here
//segreting the code importing the useerrouter here
import userRouter from './routes/user.routes.js';
import videoRouter from './routes/video.routes.js';
import tweetrouter from './routes/tweet.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import likeRouter from './routes/like.routes.js'
import healthCheckRouter from './routes/healthcheck.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import commentRouter from './routes/comment.routes.js'
//router ko hm bahar nikl kr le gye hia toh hm log middleware ka use kr rahe hai app.use(route, router import varible);
//routes decleration >> best practice is to use middleware to use router
// app.use("/users", userRouter); // we only need to write this once then we can use our router. this is basic but we are writing our api jo we need to write api
//the url will look like this-->> http://localhost:8080/users/register
app.use("/api/v1/users", userRouter); //this is as standard practice used in industires
//url will look like this -> http://localhost:8080/api/v1/users/register 
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/tweets", tweetrouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/comments", commentRouter);

// app.get("/", (req, res) => {
//     res.send("Hello backend");
// });

app.get("/", (req, res) => {
    return res.status(200).json({ message: "Server is fine and running on desired port." })
});

export { app }