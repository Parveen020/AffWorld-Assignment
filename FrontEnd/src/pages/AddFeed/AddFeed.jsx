import React, { useState, useContext, useEffect } from "react";
import "./AddFeed.css";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const AddFeed = ({ onClose, onPostAdded }) => {
  const { token, url, isLoading, setIsLoading } = useContext(UserContext);
  const [isClosing, setIsClosing] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    caption: "",
  });

  // It is code for the form that is popped up when logged in user clicks the create task button
  // function for handle how the form will be closed.
  const handleClose = () => {
    setIsClosing(true);
    onClose();
  };

  // function for showing prevew of the image in the form
  useEffect(() => {
    if (image) {
      const preview = URL.createObjectURL(image);
      setImagePreview(preview);
      return () => URL.revokeObjectURL(preview);
    }
  }, [image]);

  // function for handling on chnage property of the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // function for handle submit button operation, which submit the data to create feed api to create a feed
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
          <button type="submit" className="submit-button" disabled={isLoading}>
            Add
          </button>
        </form>
      </div>
      <Backdrop sx={{ color: "#fff", zIndex: 9999 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default AddFeed;
