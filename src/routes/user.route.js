//making ALL user route here for their work

//imporing router here
import { Router } from "express";
import { registerUser } from '../controllers/user.controller.js'


const router = Router();

router.route("/register").post(registerUser); //register a user route
// router.route("/login").post();//login a user


//exporting this router as a default
export default router;
