import { log } from "console";
import fs from "fs";
import feedModel from "../models/feedModel.js";
import userModel from "../models/userModel.js";

const createFeed = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  const userId = req.user?.id;

  try {
    const newfeed = new feedModel({
      image: image_filename,
      caption: req.body.caption,
      createdBy: userId,
    });
    const feed = await newfeed.save();
    await userModel.findByIdAndUpdate(userId, { $push: { feeds: feed._id } });

    res.status(200).json({ success: true, message: "Feed Created" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Error in a creating a post." });
  }
};

const getAllFeed = async (req, res) => {
  try {
    const response = await feedModel.find();
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "Feeds not extracted" });
    }

    res.status(200).json({
      success: true,
      message: "Feeds extracted successfully",
      feeds: response,
    });
  } catch (error) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Error in fetching all feeds" });
  }
};

export { createFeed, getAllFeed };
