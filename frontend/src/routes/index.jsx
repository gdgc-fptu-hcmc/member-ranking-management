import React from "react";
import LandingPage from "../pages/LandingPage.jsx";

import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Member from "../pages/Member.jsx";
import Admin from "../pages/Admin.jsx";

import RequireAuth from "../auth/RequireAuth.jsx";
import RequireRole from "../auth/RequireRole.jsx";

export const routes = [
  { path: "/", element: <LandingPage /> },

  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    path: "/member",
    element: (
      <RequireAuth>
        <Member />
      </RequireAuth>
    ),
  },

  {
    path: "/admin",
    element: (
      <RequireRole allowedRoles={["admin"]}>
        <Admin />
      </RequireRole>
    ),
  },
];
