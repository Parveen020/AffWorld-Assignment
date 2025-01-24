import express from "express";
import {
  forgotPassword,
  getUser,
  loginUser,
  registerUser,
} from "../controllers/userController.js";

const userRouter = express.Router();
userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.post("/forgotPassword", forgotPassword);
userRouter.post("/getUser", getUser);

export default userRouter;
