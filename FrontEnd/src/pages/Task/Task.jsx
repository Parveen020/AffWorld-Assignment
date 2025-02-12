// Task.jsx
import React, { useContext, useState, useEffect, useRef } from "react";
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
  const [draggedItem, setDraggedItem] = useState(null);
  const [touchStartColumn, setTouchStartColumn] = useState(null);
  const taskRefs = useRef({});

  useEffect(() => {
    if (token && data && data.userId) {
      fetchTasks();
      setShowLogin(false);
    } else if (!token) {
      setTasks({ Pending: [], Completed: [], Done: [] });
    }
  }, [token, data]);

  useEffect(() => {
    return () => {
      Object.values(taskRefs.current).forEach((element) => {
        if (element) {
          element.removeEventListener("touchmove", handleTouchMove);
          element.removeEventListener("touchend", handleTouchEnd);
        }
      });
    };
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      if (!data || !data.userId) {
        setShowLogin(true);
        return;
      }

      const response = await axios.post(`${url}/AffWorld/getAllTasks`, {
        id: data.userId,
      });

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
      console.error("Full error:", error);
      setShowLogin(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

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
      toast.error("Error deleting task: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Desktop drag handlers
  const handleDragStart = (e, task, sourceColumn) => {
    e.dataTransfer.setData("task", JSON.stringify(task));
    e.dataTransfer.setData("sourceColumn", sourceColumn);
    e.dataTransfer.effectAllowed = "move";
  };

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
      toast.error("Error updating task status: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Mobile touch handlers
  const handleTouchStart = (e, task, sourceColumn) => {
    const element = e.currentTarget;
    taskRefs.current[task._id] = element;

    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: false });

    setDraggedItem(task);
    setTouchStartColumn(sourceColumn);
    element.style.opacity = "0.5";
    element.style.transform = "scale(1.05)";
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const element = e.currentTarget;

    const newX = touch.clientX - element.offsetWidth / 2;
    const newY = touch.clientY - element.offsetHeight / 2;

    element.style.position = "fixed";
    element.style.left = `${newX}px`;
    element.style.top = `${newY}px`;
    element.style.zIndex = "1000";
  };

  const handleTouchEnd = async (e) => {
    e.preventDefault();
    if (!draggedItem || !touchStartColumn) return;

    const element = taskRefs.current[draggedItem._id];
    if (!element) return;

    // Reset element styles
    element.style.opacity = "1";
    element.style.position = "";
    element.style.left = "";
    element.style.top = "";
    element.style.zIndex = "";
    element.style.transform = "";

    // Remove event listeners
    element.removeEventListener("touchmove", handleTouchMove);
    element.removeEventListener("touchend", handleTouchEnd);

    // Get drop target
    const touch = e.changedTouches[0];
    const targetElement = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );
    const targetColumn = targetElement
      ?.closest(".task-column")
      ?.getAttribute("data-column");

    if (!targetColumn || targetColumn === touchStartColumn) {
      setDraggedItem(null);
      setTouchStartColumn(null);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.put(
        `${url}/AffWorld/updateTask/${draggedItem._id}`,
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
          const sourceColumnTasks = prevTasks[touchStartColumn].filter(
            (task) => task._id !== draggedItem._id
          );
          const updatedTask = { ...draggedItem, status: targetColumn };
          toast.success("Task status updated to " + targetColumn);
          return {
            ...prevTasks,
            [touchStartColumn]: sourceColumnTasks,
            [targetColumn]: [...prevTasks[targetColumn], updatedTask],
          };
        });
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Error updating task status: " + error.message);
    } finally {
      setIsLoading(false);
      setDraggedItem(null);
      setTouchStartColumn(null);
    }
  };

  // Update the renderColumn function to handle delete button touch events separately
  const renderColumn = (columnName, columnTitle) => {
    return (
      <div
        className="task-column"
        data-column={columnName}
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
              onTouchStart={(e) => {
                // Check if the touch target is not the delete button
                if (!e.target.closest(".delete-btn")) {
                  handleTouchStart(e, task, columnName);
                }
              }}
              className="task-item"
            >
              <div className="task-info">
                <h3>{task.name}</h3>
                <p>{task.description}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(columnName, task._id);
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  deleteTask(columnName, task._id);
                }}
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
