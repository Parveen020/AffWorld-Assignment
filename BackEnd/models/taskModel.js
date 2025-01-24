import mongoose from "mongoose";

// task model that include name of the task, description, status(by default Pending), createdBy(user id, which create it)
const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Done"],
      default: "Pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const taskModel = mongoose.models.task || mongoose.model("task", taskSchema);
export default taskModel;
