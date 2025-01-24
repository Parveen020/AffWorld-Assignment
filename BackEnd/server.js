import express from "express";
import multer from "multer";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import feedRouter from "./routes/feedRoutes.js";

// creating app
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//db connection
connectDB();

// route for user, task and feed
app.use("/AffWorld", userRouter);
app.use("/AffWorld", taskRouter);
app.use("/AffWorld", feedRouter);
// route for image upload.
app.use("/images", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API Working");
});
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
