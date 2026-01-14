import React from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function LogoutButton() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api.post("/v1/auth/logout");
    } finally {
      setAuth(null);
      navigate("/login", { replace: true });
    }
  };

  return (
    <button
      onClick={logout}
      className="mt-4 px-4 py-2 rounded-xl bg-gray-900 text-white"
    >
      Logout
    </button>
  );
}
