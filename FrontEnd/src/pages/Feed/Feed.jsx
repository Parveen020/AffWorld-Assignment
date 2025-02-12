import React, { useState, useContext, useEffect } from "react";
import "./Feed.css";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import AddFeed from "../AddFeed/AddFeed";
import Login from "../../components/Login/Login";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Menu, X } from "lucide-react"; // Import from lucide-react

const Feeds = () => {
  const { token, url, setShowLogin, isLoading, setIsLoading } =
    useContext(UserContext);
  const [feedPopUp, setFeedPopUp] = useState(false);
  const [loginPopUp, setLoginPopUp] = useState(false);
  const [feeds, setFeeds] = useState([]);
  const [showMenu, setShowMenu] = useState(false); // State for controlling the menu

  const getAllFeeds = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${url}/AffWorld/getAllFeed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const sortedFeeds = response.data.feeds.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setFeeds(sortedFeeds);
      } else {
        alert("Error fetching feeds");
      }
    } catch (error) {
      console.error("Error fetching feeds: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllFeeds();
  }, []);

  const handleAddFeed = () => {
    if (!token) {
      setShowLogin(true);
    } else {
      setFeedPopUp(true);
    }
  };

  const handlePostAdded = () => {
    setFeedPopUp(false);
    getAllFeeds();
  };

  return (
    <div className="feed-container">
      <div className="feed-container-window">
        <div className="feed-header">
          <h3>Posts</h3>
          <div className="header-buttons">
            <button
              className="create-button"
              onClick={handleAddFeed}
              disabled={isLoading}
            >
              Create Post
            </button>
            <button
              className="refresh-button"
              onClick={getAllFeeds}
              disabled={isLoading}
            >
              Refresh
            </button>
          </div>
          {/* Hamburger Menu Icon */}
          <div className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
            {showMenu ? <X /> : <Menu />}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="mobile-menu">
            <button
              className="mobile-create-button"
              onClick={handleAddFeed}
              disabled={isLoading}
            >
              Create Post
            </button>
            <button
              className="mobile-refresh-button"
              onClick={getAllFeeds}
              disabled={isLoading}
            >
              Refresh
            </button>
          </div>
        )}

        <div className="feed-body">
          {feeds.map((feed) => (
            <div className="single-feed" key={feed._id}>
              <div className="single-feed-image">
                <img src={`${url}/images/` + feed.image} alt="Feed" />
              </div>
              <div className="single-feed-info">
                <p>{feed.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {feedPopUp && (
        <AddFeed
          onClose={() => setFeedPopUp(false)}
          onPostAdded={handlePostAdded}
        />
      )}
      {loginPopUp && (
        <Login
          onClose={() => setLoginPopUp(false)}
          onSuccess={() => {
            setLoginPopUp(false);
            setFeedPopUp(true);
          }}
        />
      )}

      <Backdrop sx={{ color: "#fff", zIndex: 9999 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Feeds;
