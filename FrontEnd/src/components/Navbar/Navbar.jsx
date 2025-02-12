import React, { useState, useContext } from "react";
import "./Navbar.css";
import { UserContext } from "../../context/UserContext";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { token, setShowLogin, data, logout } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const name = data?.name;

  const getUserName = (name) =>
    name
      ? name
          .split(" ")
          .map((word) => word[0].toUpperCase())
          .join("")
      : "";

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div className="navbar">
      <div className="navbar-brand">
        Hi, <span>{name || "Guest"}</span>
      </div>
      <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>
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
      <div className="hamburger-menu" onClick={toggleMenu}>
        {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
      </div>
    </div>
  );
};

export default Navbar;
