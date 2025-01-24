import React, { useContext } from "react";
import "./Navbar.css";
import { UserContext } from "../../context/UserContext";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const { token, setShowLogin, data, logout } = useContext(UserContext);
  const name = data?.name;

  const getUserName = (name) =>
    name
      ? name
          .split(" ")
          .map((word) => word[0].toUpperCase())
          .join("")
      : "";

  return (
    <div className="navbar">
      <div className="navbar-brand">Hi, {name || "Guest"}</div>
      <div className="navbar-links">
        <NavLink to="/" className="nav-link"></NavLink>
        <NavLink to="/feed" className="nav-link">
          Feed
        </NavLink>
        <NavLink to="/task" className="nav-link">
          Task
        </NavLink>
        {token ? (
          <button
            onClick={() => {
              logout();
              toast.success("You are Logged out!!!");
            }}
            className="user-button"
          >
            {getUserName(name)}
          </button>
        ) : (
          <button onClick={() => setShowLogin(true)} className="login-button">
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
