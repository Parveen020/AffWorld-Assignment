import React, { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { UserContext } from "./context/UserContext";
import Login from "./components/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Feed from "./pages/Feed/Feed";
import Task from "./pages/Task/Task";

const App = () => {
  const { token, showLogin, setShowLogin } = useContext(UserContext);

  // useEffect function, always called first when ever the site is loaded
  useEffect(() => {
    if (token) {
      setShowLogin(false); // when user is logged in then login pop stay closed
    }
  }, []);

  // toastcontainer is for toast notification
  // if showlogin is true then login pop up will be shown
  // Routes to different pages, home page route is consider as Feed where user can see different posts without login too.
  // Footer component

  return (
    <>
      <ToastContainer />
      {showLogin ? <Login onClose={() => setShowLogin(false)} /> : <></>}
      <>
        <Navbar />
        <hr />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/task" element={<Task />} />
        </Routes>
        <Footer />
      </>
    </>
  );
};

export default App;
