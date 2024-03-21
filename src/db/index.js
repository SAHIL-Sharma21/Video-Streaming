//writing db logic here
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


//making connectDB function and exporting it

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`); //mongoose connect return an object by which we are storing in variable
        console.log(`\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('MONGODB connection Failed :', error);
        process.exit(1);
    }
}

export default connectDB;