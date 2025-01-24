import express from "express";
import {
  createTask,
  deleteTask,
  updateTask,
  getAllTask,
} from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

// creating router for tasks
const taskRouter = express.Router();

// creating routes for every action in the task

// create task route, it needs auth middlewale to create a Task
taskRouter.post("/createTask", authMiddleware, createTask);
// update route, put request
taskRouter.put("/updateTask/:id", updateTask);
// delete route, delete request
taskRouter.delete("/deleteTask/:id", deleteTask);
// getAllTask route, post request
taskRouter.post("/getAllTasks", getAllTask);

// exporting router
export default taskRouter;
