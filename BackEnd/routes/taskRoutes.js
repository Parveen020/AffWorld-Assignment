import express from "express";
import {
  createTask,
  deleteTask,
  updateTask,
  getAllTask,
} from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const taskRouter = express.Router();
taskRouter.post("/createTask", authMiddleware, createTask);
taskRouter.put("/updateTask/:id", updateTask);
taskRouter.delete("/deleteTask/:id", deleteTask);
taskRouter.post("/getAllTasks", getAllTask);
export default taskRouter;
