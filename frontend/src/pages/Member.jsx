import React from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import LogoutButton from "./_LogoutButton.jsx";

export default function Member() {
  const { auth } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold">Bạn là MEMBER</h1>
        <p className="mt-2">
          Roles: {(auth?.roles ?? []).join(", ") || "(none)"}
        </p>
        <LogoutButton />
      </div>
    </div>
  );
}
