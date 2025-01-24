import mongoose from "mongoose";

// user model that stores the  name, email, password,
// tasks as an array[that includes all the task id that he has created]
// and feeds as an array[that stores all the feeds id]
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    feeds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feed",
      },
    ],
  },
  { timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
