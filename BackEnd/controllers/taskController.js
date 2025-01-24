import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";

const createTask = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user?.id;

  if (!name || !description) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  if (!name.trim() || !description.trim()) {
    return res.status(400).json({
      success: false,
      message: "Fields cannot be empty or whitespace",
    });
  }

  try {
    const newTask = new taskModel({
      name,
      description,
      createdBy: userId,
    });

    const task = await newTask.save();

    await userModel.findByIdAndUpdate(userId, { $push: { tasks: task._id } });

    res.status(201).json({ success: true, task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    if (!status || !["Pending", "Completed", "Done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedTask = await taskModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await taskModel.findByIdAndDelete(id);

    if (!deletedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error deleting task" });
  }
};

const getAllTask = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const tasks = await taskModel.find({ createdBy: id });

    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      tasks: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

export { createTask, updateTask, deleteTask, getAllTask };
