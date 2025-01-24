import React, { useState, useContext, useEffect } from "react";
import "./AddFeed.css";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const AddFeed = ({ onClose, onPostAdded }) => {
  const { token, url } = useContext(UserContext);
  const [isClosing, setIsClosing] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    caption: "",
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  useEffect(() => {
    if (image) {
      const preview = URL.createObjectURL(image);
      setImagePreview(preview);
      return () => URL.revokeObjectURL(preview);
    }
  }, [image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("image", image);
      form.append("caption", formData.caption);

      const response = await axios.post(`${url}/AffWorld/createFeed`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        onPostAdded();
        onClose();
        setFormData({ caption: "" });
        setImage(null);
        setImagePreview(null);
        toast.success("Feed added successfully!");
      }
    } catch (error) {
      alert("Error adding feed: " + error.message);
      toast.error("Error adding feed");
    }
  };

  return (
    <div className="popup-overlay">
      <div className={`popup-container ${isClosing ? "closing" : ""}`}>
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        <h2>Add Feed</h2>
        <form onSubmit={handleSubmit} className="popup-form">
          <div className="image-upload-container">
            <label htmlFor="image-upload" className="image-upload-label">
              <img
                src={imagePreview || assets.upload_area}
                alt="Upload preview"
                className="upload-preview"
              />
            </label>
            <input
              type="file"
              id="image-upload"
              onChange={(e) => setImage(e.target.files[0])}
              hidden
              accept="image/*"
              required
            />
          </div>
          <textarea
            name="caption"
            value={formData.caption}
            onChange={handleChange}
            rows="4"
            placeholder="Write caption"
            className="form-textarea"
            required
          />
          <button type="submit" className="submit-button">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFeed;

const addTask = async () => {
  try {
    const taskData = {
      name: formData.name,
      description: formData.description,
    };

    const response = await axios.post(`${url}/AffWorld/createTask`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      setTasks((prevTasks) => ({
        ...prevTasks,
        pending: [...prevTasks.pending, response.data.task],
      }));
      setFormData({ name: "", description: "" });
    }
  } catch (error) {
    alert("Error adding task: " + error.message);
  }
};
