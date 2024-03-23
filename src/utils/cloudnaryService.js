//writing and setting up cloudnary service code here  >> we will upload user file/pdf/ photos on cloudnnary and we get the url

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

//cloudnary configration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


//making function so that it will take path as a parameter and upload on cloudinary and it will unlink the file from our server
const uploadOnCloudinary = async (localFilePath) => {
    try {
        //if localFilePath is not found then return null
        if (!localFilePath) return null;

        //logic for upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });

        //file has successfully uploaded
        console.log('file has uploaded successfully on clouinary!', response.url); //logging reponse.url if the file is uploaded sucessfuly 
        return response; //returing response to user
    } catch (error) {
        //removing file from our server
        fs.unlinkSync(localFilePath); //remove the locally saved temprory file as the upload operation got failed
        return null;
    }
}

export { uploadOnCloudinary }