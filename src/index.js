// index file

// require('dotenv').config({ path: './env' });
import dotenv from 'dotenv'; //using import statement
import connectDB from './db/index.js'
dotenv.config({
    path: './env'
});


connectDB();


























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