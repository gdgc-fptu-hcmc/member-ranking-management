import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function RequireRole({ allowedRoles = [], children }) {
  const { auth } = useAuth();

  if (!auth?.accessToken) return <Navigate to="/login" replace />;

  const roles = auth?.roles ?? [];
  const ok = allowedRoles.some((r) => roles.includes(r));
  if (!ok) return <Navigate to="/member" replace />;

  return children;
}
