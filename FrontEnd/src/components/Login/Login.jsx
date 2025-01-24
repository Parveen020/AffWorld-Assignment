import React, { useState, useContext } from "react";
import "./Login.css";
import { assets } from "../../assets/assets";
import { UserContext } from "../../context/UserContext";

const Login = ({ onClose }) => {
  const { login, register, forgotPassword } = useContext(UserContext);
  const [currentState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (currentState === "Login") {
      login(data, onClose);
    } else if (currentState === "Sign Up") {
      register(data, setCurrentState);
    } else if (currentState === "Forgot Password") {
      forgotPassword(data, setCurrentState);
    }
  };

  return (
    <div className="LoginPopUp">
      <form onSubmit={onSubmitHandler} className="LoginPopUp-container">
        <div className="LoginPopUp-title">
          <h2>{currentState}</h2>
          <img onClick={() => onClose()} src={assets.cross_icon} alt="Close" />
        </div>
        <div className="LoginPopUp-input">
          {currentState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          {(currentState === "Login" || currentState === "Sign Up") && (
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type="password"
              placeholder="Password"
              required
            />
          )}
          {currentState === "Forgot Password" && (
            <>
              <input
                name="newPassword"
                onChange={onChangeHandler}
                value={data.newPassword}
                type="password"
                placeholder="New Password"
                required
              />
              <input
                name="confirmPassword"
                onChange={onChangeHandler}
                value={data.confirmPassword}
                type="password"
                placeholder="Confirm Password"
                required
              />
            </>
          )}
        </div>
        <button type="submit">
          {currentState === "Sign Up"
            ? "Create Account"
            : currentState === "Login"
            ? "Login"
            : "Update Password"}
        </button>
        {currentState === "Login" && (
          <p>
            New here?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Sign Up</span>
          </p>
        )}
        {currentState === "Sign Up" && (
          <p>
            Have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login</span>
          </p>
        )}
        {currentState !== "Forgot Password" && (
          <p>
            Forgot Password?{" "}
            <span onClick={() => setCurrentState("Forgot Password")}>
              Reset Password
            </span>
          </p>
        )}
        ;
      </form>
    </div>
  );
};

export default Login;
