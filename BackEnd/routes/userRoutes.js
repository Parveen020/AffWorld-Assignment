import express from "express";
import {
  forgotPassword,
  getUser,
  loginUser,
  registerUser,
} from "../controllers/userController.js";

// user router
const userRouter = express.Router();
// login route, post request
userRouter.post("/login", loginUser);
// register route, post request
userRouter.post("/register", registerUser);
// forgot Password route, post request
userRouter.post("/forgotPassword", forgotPassword);
// getUser route, post request
userRouter.post("/getUser", getUser);

// exporting a router
export default userRouter;
