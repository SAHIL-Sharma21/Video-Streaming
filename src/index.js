// index file

// require('dotenv').config({ path: './env' });
import dotenv from 'dotenv'; //using import statement
import connectDB from './db/index.js'
import { app } from './app.js';
dotenv.config({
    path: './env'
});

//writing promise method if database is connected then our app will listen on some port ortherwise throw error
connectDB()
    .then(() => {
        //if our app have some error then it will
        app.on("error", (error) => {
            console.log(`Server is facing some error: ${error}`);
        });
        //our app will listen
        app.listen(process.env.PORT || 4000, () => {
            console.log(`our app is listening on PORT: ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log('MongoDB connection failed!!', error);
    });


























//not the best aproach
// const app = express();
// // using IIFE to connect to Db >> better apprach >> these semicoln (;) is for cleaning purpose ke liye hota hai
// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//         app.on("error", (error) => {
//             console.log("Error: ", error);
//             throw error;
//         });
//         app.listen(process.env.PORT, () => {
//             console.log(`app is listening on port: ${process.env.PORT}`);
//         });
//     } catch (error) {
//         console.error("Error: ", error);
//         throw error;
//     }
// })();