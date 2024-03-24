//making user models here now we are making structure of our model in which our data is stored in databses
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true //for searching field in DB
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, //cloudnary url
            required: true
        },
        coverImage: {
            type: String //cloudnary url
        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password field required']
        },
        refreshToken: {
            type: String,
        }
    }, { timestamps: true }); //createdAt and updatedAt will be get by the timpestamps in 2nd object

//using pre middleware to just hash our password before storing userdata to our database.
// we have to use normal annomous function and we cannot use our normal arrow function as arrow function does noit have access to this keyword, we have to give coontext to our userSchema
// as this is middleware and it will take some time to  do some task so this is why we use async and middleware have next just to pass flag to next.
userSchema.pre("save", async function (next) {

    //we are solving one problem if we change/modify some data then this pre wil always run and hash our password on every modification so we have to avoid it
    //avoiding re-hasing of password
    //agr password modify nhi hua to next return krdo
    if (!this.isModified("password")) return next();

    //hassing our password
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


//user ko jb bhi import karaye toh user se phuch le ki password sahi hai ya nahi kyuki DB mei hashed password hai and user nei normal 'user@122' use kiya hua ho skta hai.
//defining our custom methods
//its just like we do it in js with prototype writing our custom method
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password); //compare take 2 parameter 1st -> is password which user will give and 2nd -> is our hashed password.
} //this function will return true or false


//writing method to generate jwt >> Access token
userSchema.methods.generateAccessToken = function () {
    // writing our logic to generate token
    return jwt.sign(
        //{payload/data} , access token, {expires IN}
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
}

//generating refresh token jo hm database mei store krenge
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
}

export const User = mongoose.model('User', userSchema);