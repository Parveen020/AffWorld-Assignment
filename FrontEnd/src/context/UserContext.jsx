import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const UserContext = createContext(null);

const UserContextProvider = (props) => {
  const url = "http://localhost:4000";
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState(() => {
    const storedUser = localStorage.getItem("userData");
    return storedUser
      ? JSON.parse(storedUser)
      : { name: "", tasks: [], userId: "" };
  });

  const getUser = async (email) => {
    try {
      const response = await axios.post(`${url}/AffWorld/getUser`, { email });
      if (response.data.success && response.data.user) {
        const userData = response.data.user;
        setData(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const login = async (loginData, onClose) => {
    try {
      const response = await axios.post(`${url}/AffWorld/login`, loginData);
      if (response.data.success) {
        toast.success("Login successful");
        getUser(loginData.email);
        setToken(response.data.token);
        setEmail(loginData.email);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", loginData.email);
        onClose();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      toast.error("Error during login:", error);
    }
  };

  const register = async (registerData, setState) => {
    try {
      const response = await axios.post(
        `${url}/AffWorld/register`,
        registerData
      );
      if (response.data.success) {
        toast.success("Registration successful! Please log in.");
        setState("Login");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const forgotPassword = async (passwordData, setState) => {
    try {
      const response = await axios.post(
        `${url}/AffWorld/forgotPassword`,
        passwordData
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setState("Login");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error during password reset:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userData");
    setToken("");
    setEmail("");
    setData({ name: "", tasks: [] });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    if (storedToken && storedEmail) {
      setToken(storedToken);
      setEmail(storedEmail);
      getUser(storedEmail);
    }
  }, []);

  const contextValue = {
    url,
    token,
    setToken,
    email,
    setEmail,
    data,
    setData,
    showLogin,
    setShowLogin,
    getUser,
    login,
    register,
    forgotPassword,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
