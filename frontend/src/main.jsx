import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import AuthBootstrap from "./auth/AuthBootstrap.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AuthBootstrap>
          <App />
        </AuthBootstrap>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
