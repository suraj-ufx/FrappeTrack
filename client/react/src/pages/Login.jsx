import { useState } from "react";
import fav from '../assets/favicon.webp'
import { useAuthStore } from "../store/authStore";
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, authLoading } = useAuthStore()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username || !password) return;

    // Call your existing login function
    const loginResponse = await login(username, password);

    console.log("Login response from API:", loginResponse);

    if (loginResponse.message.success && window.electronAPI) {
      await window.electronAPI.setLogin(loginResponse);
      navigate('/user-profile')
    }
  }


  if (authLoading) return <div className="min-h-screen flex justify-center items-center bg-black text-white">Loading...</div>
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-50 font-sans">
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-2xl shadow-[0_20px_45px_rgba(0,0,0,0.12)] px-8 pt-9 pb-10">

          {/* Logo */}
          <div className="text-center mb-6">
            <img
              src={fav}
              alt="Logo"
              className="w-14 mx-auto mb-2"
            />
            <h2 className="text-2xl font-bold text-[#0b1b4d]">
              UnifyXperts
            </h2>
            <p className="text-sm text-gray-500 mt-4">
              Login your tracker account
            </p>
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1">
              Username or Email
            </label>
            <input
              type="text"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-xs text-gray-500 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            className="w-full rounded-xl bg-indigo-600 py-3 text-white font-semibold transition hover:bg-indigo-700 active:translate-y-[1px]"
          >
            Sign in
          </button>

          {/* Footer */}
          <div className="text-center mt-6">
            <small className="text-gray-400">
              © 2025 UnifyXperts India, All rights reserved
            </small>
          </div>

        </div>
      </div>
    </div>
  );
}
