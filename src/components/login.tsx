"use client";

import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";

interface Props {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/auth/login`, {
        email: form.email,
        password: form.password,
      });
      // console.log(res);

      if (res.data.success) {
        sessionStorage.setItem("token", res.data.token);
        onLogin();
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error :any) {
      console.log(error);
      toast.error(error?.response?.data?.message || error?.message ||"Failed to Login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-md rounded px-8 py-6 w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4 dark:text-gray-100">
          Login
        </h2>

        <div>
          <label className="block mb-1 font-medium dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300  p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
