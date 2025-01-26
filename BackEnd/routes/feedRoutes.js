import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createFeed, getAllFeed } from "../controllers/feedController.js";
import multer from "multer";
import fs from "fs";

const feedRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

feedRouter.post(
  "/createFeed",
  upload.single("image"),
  authMiddleware,
  createFeed
);
feedRouter.get("/getAllFeed", getAllFeed);

export default feedRouter;
