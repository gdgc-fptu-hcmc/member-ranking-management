import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await api.post("/v1/auth/login", form);
      const { accessToken, roles, user } = res.data;

      setAuth({ user, roles, accessToken });

      const isAdmin = (roles ?? []).includes("admin");
      if (isAdmin) {
        navigate("/admin", { replace: true });
        return;
      }

      // member mới dùng goBack
      const goBack = location.state?.from;
      if (goBack) {
        navigate(goBack, { replace: true });
        return;
      }

      navigate("/member", { replace: true });
    } catch (err) {
      setMsg(err?.response?.data || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full border rounded-xl px-3 py-2"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={onChange}
          />
          <input
            className="w-full border rounded-xl px-3 py-2"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
          />

          <button className="w-full bg-black text-white rounded-xl py-2 font-semibold hover:bg-gray-800 transition-colors cursor-pointer">
            Login
          </button>
        </form>

        {msg && <p className="text-red-600 mt-3">{String(msg)}</p>}

        <p className="mt-4 text-sm">
          No account?{" "}
          <Link className="underline" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
