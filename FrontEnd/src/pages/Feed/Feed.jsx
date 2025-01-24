import React, { useState, useContext, useEffect } from "react";
import "./Feed.css";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import AddFeed from "../AddFeed/AddFeed";
import Login from "../../components/Login/Login";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Feeds = () => {
  const { token, url, setShowLogin, isLoading, setIsLoading } =
    useContext(UserContext);
  const [feedPopUp, setFeedPopUp] = useState(false);
  const [loginPopUp, setLoginPopUp] = useState(false);
  const [feeds, setFeeds] = useState([]);

  // it is a code where all feeds are shown with image and caption

  // function that fethces all the feeds from database through an api created in backEnd
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

  // fucntion for fetching feeds on loading a page
  useEffect(() => {
    getAllFeeds();
  }, []);

  // function for handle Add feed, which shows the login pop up when user is
  // not logged in and show the add feed form on if user is login
  const handleAddFeed = () => {
    if (!token) {
      setShowLogin(true);
    } else {
      setFeedPopUp(true);
    }
  };

  // function to fetching all feeds after adding a feed
  // also it has Refresh button if feeds is not loaded then
  // user can press the button to load all the feeds.
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
        </div>
        <div className="feed-body">
          {feeds.map((feed) => (
            <div className="single-feed" key={feed._id}>
              <div className="single-feed-image">
                <img src={`${url}/images/${feed.image}`} alt="Feed" />
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
