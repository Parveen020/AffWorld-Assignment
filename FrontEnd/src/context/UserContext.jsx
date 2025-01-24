import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const UserContext = createContext(null);

const UserContextProvider = (props) => {
  const url = "https://affworld-assignment-e6vb.onrender.com";
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState(() => {
    const storedUser = localStorage.getItem("userData");
    return storedUser
      ? JSON.parse(storedUser)
      : { name: "", tasks: [], userId: "" };
  });

  //getUser function
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

  // login function
  const login = async (loginData, onClose) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  // register function
  const register = async (registerData, setState) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  // forgot password function
  const forgotPassword = async (passwordData, setState) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  // logout function
  const logout = () => {
    setIsLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userData");
    setToken("");
    setEmail("");
    setData({ name: "", tasks: [] });
    setIsLoading(false);
  };

  // useEffect function, always called first when ever the site is loaded
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    if (storedToken && storedEmail) {
      setToken(storedToken);
      setEmail(storedEmail);
      getUser(storedEmail);
    }
  }, []);

  // context variables
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
    isLoading,
    setIsLoading,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
