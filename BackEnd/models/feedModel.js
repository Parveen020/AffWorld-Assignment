import mongoose from "mongoose";

const feedSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const feedModel = mongoose.models.feed || mongoose.model("feed", feedSchema);
export default feedModel;
