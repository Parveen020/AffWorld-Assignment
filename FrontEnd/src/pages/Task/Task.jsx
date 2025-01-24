import React, { useContext, useState, useEffect } from "react";
import "./Task.css";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Task = () => {
  const { token, url, data, setShowLogin, isLoading, setIsLoading } =
    useContext(UserContext);
  const [tasks, setTasks] = useState({
    Pending: [],
    Completed: [],
    Done: [],
  });
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    // if user is login then tasks created by him will be loaded and login pop up goes down
    // and if user is not login then tasks different fields are setted as null
    if (token && data && data.userId) {
      fetchTasks();
      setShowLogin(false);
    } else if (!token) {
      setTasks({ Pending: [], Completed: [], Done: [] });
    }
  }, [token, data]);

  //function to extract all tasks for login user and divinding them based on their status
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      // if user is not logged in then login pop up will be displayed
      if (!data || !data.userId) {
        setShowLogin(true);
        return;
      }

      //fetching responses through an api from database
      const response = await axios.post(`${url}/AffWorld/getAllTasks`, {
        id: data.userId,
      });

      // dividing them based on their status and storing them into tasks.
      if (response.data.success) {
        const organizedTasks = {
          Pending: response.data.tasks.filter(
            (task) => task.status === "Pending"
          ),
          Completed: response.data.tasks.filter(
            (task) => task.status === "Completed"
          ),
          Done: response.data.tasks.filter((task) => task.status === "Done"),
        };
        setTasks(organizedTasks);
      }
    } catch (error) {
      // if user is not logged in then showing login pop up.
      console.error("Full error:", error);
      setShowLogin(true);
    } finally {
      setIsLoading(false);
    }
  };

  // function for handing changes in the database
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // function for add a task
  const addTask = async () => {
    if (!token) {
      setShowLogin(true);
      return;
    }
    try {
      setIsLoading(true);
      const taskData = {
        name: formData.name,
        description: formData.description,
      };

      const response = await axios.post(
        `${url}/AffWorld/createTask`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        fetchTasks();
        setFormData({ name: "", description: "" });
        toast.success("Task added successfully");
      }
    } catch (error) {
      console.log("Error adding task: " + error.message);
      setShowLogin(true);
    } finally {
      setIsLoading(false);
    }
  };

  // function for handling key press when user hits enter after filling form then form get's submitted
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  // function for handling delete operation on every task.
  const deleteTask = async (columnName, taskId) => {
    try {
      setIsLoading(true);
      await axios.delete(`${url}/AffWorld/deleteTask/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks((prevTasks) => ({
        ...prevTasks,
        [columnName]: prevTasks[columnName].filter(
          (task) => task._id !== taskId
        ),
      }));
      toast.success("Tasks deleted successfully");
    } catch (error) {
      alert("Error deleting task: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // function for handle dragging operation on every task
  const handleDragStart = (e, task, sourceColumn) => {
    e.dataTransfer.setData("task", JSON.stringify(task));
    e.dataTransfer.setData("sourceColumn", sourceColumn);
  };

  // function for updating task status to column name on which they are dragged
  const handleDrop = async (e, targetColumn) => {
    e.preventDefault();
    const taskData = JSON.parse(e.dataTransfer.getData("task"));
    const sourceColumn = e.dataTransfer.getData("sourceColumn");

    if (sourceColumn === targetColumn) return;

    try {
      setIsLoading(true);
      const response = await axios.put(
        `${url}/AffWorld/updateTask/${taskData._id}`,
        { status: targetColumn },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setTasks((prevTasks) => {
          const sourceColumnTasks = prevTasks[sourceColumn].filter(
            (task) => task._id !== taskData._id
          );
          const updatedTask = { ...taskData, status: targetColumn };
          toast.success("Task status updated to " + targetColumn);
          return {
            ...prevTasks,
            [sourceColumn]: sourceColumnTasks,
            [targetColumn]: [...prevTasks[targetColumn], updatedTask],
          };
        });
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Error updating task status: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // function for rendering/showing three different columns with data
  const renderColumn = (columnName, columnTitle) => {
    return (
      <div
        className="task-column"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, columnName)}
      >
        <div className="task-column-heading">
          <h2>{columnTitle}</h2>
        </div>
        <div className="task-column-body">
          {tasks[columnName]?.map((task) => (
            <div
              key={task._id}
              draggable
              onDragStart={(e) => handleDragStart(e, task, columnName)}
              className="task-item"
            >
              <div className="task-info">
                <h3>{task.name}</h3>
                <p>{task.description}</p>
              </div>
              <button
                onClick={() => deleteTask(columnName, task._id)}
                className="delete-btn"
                disabled={isLoading}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="task-management">
      <div className="task-input">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder="Name"
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder="Description"
        />
        <button onClick={addTask} disabled={isLoading}>
          Add Task
        </button>
      </div>
      <div className="task-board">
        {renderColumn("Pending", "Pending")}
        {renderColumn("Completed", "Completed")}
        {renderColumn("Done", "Done")}
      </div>
      <Backdrop sx={{ color: "#fff", zIndex: 9999 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Task;
