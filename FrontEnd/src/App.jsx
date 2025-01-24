import React, { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { UserContext } from "./context/UserContext";
import Login from "./components/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import Feed from "./pages/Feed/Feed";
import Task from "./pages/Task/Task";

const App = () => {
  const { token, showLogin, setShowLogin } = useContext(UserContext);

  useEffect(() => {
    if (token) {
      setShowLogin(false);
    }
  }, []);

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
      </>
    </>
  );
};

export default App;
