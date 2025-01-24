import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UserContextPrivder from "./context/userContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserContextPrivder>
      <App />
    </UserContextPrivder>
  </BrowserRouter>
);
