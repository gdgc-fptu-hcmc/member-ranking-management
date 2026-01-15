import React from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import LogoutButton from "./_LogoutButton.jsx";

export default function Member() {
  const { auth } = useAuth();
  const user = auth?.user;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold">Bạn là MEMBER</h1>
        <div className="space-y-2">
          <p>
            <strong>Email:</strong> {user?.email || "N/A"}
          </p>
          <p>
            <strong>Roles:</strong> {(auth?.roles ?? []).join(", ") || "None"}
          </p>
          <p>
            <strong>Total Gems:</strong> {user?.totalGems ?? 0}
          </p>
          <p>
            <strong>Status:</strong> {user?.isActive ? "Active" : "Inactive"}
          </p>

          <div className="pt-4">
            <h2 className="font-semibold">Statistics:</h2>
            <ul className="list-disc ml-5 mt-1">
              <li>Sessions: {user?.stats?.regularSessionCount ?? 0}</li>
              <li>Meetings: {user?.stats?.meetingsCount ?? 0}</li>
              <li>Competitions: {user?.stats?.competitionsCount ?? 0}</li>
            </ul>
          </div>

          <p className="pt-4 text-sm text-gray-400">
            Joined:{" "}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
