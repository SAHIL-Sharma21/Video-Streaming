//making multer middleware here so that we can inject anywhere we have to use to upload file
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp"); //storing file on our public/temp folder
    },
    //using filename
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

export const upload = multer({
    storage, //storage: storage
});