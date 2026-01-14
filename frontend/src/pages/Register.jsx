import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/axios.js";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [msg, setMsg] = useState("");

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/v1/auth/register", form);
      navigate("/login");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Register</h1>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full border rounded-xl px-3 py-2"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
          />
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

          <button className="w-full bg-black text-white rounded-xl py-2 font-semibold">
            Create account
          </button>
        </form>

        {msg && <p className="text-red-600 mt-3">{msg}</p>}

        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <Link className="underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
