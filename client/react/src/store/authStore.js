import { create } from "zustand";
import axiosInstance from "../config/api";
import toast from "react-hot-toast";
import axios from "axios";

export const useAuthStore = create((set) => ({
    user: null,
    authLoading: false,
    isAuthenticated: false,
    error: null,

    login: async (username, password) => {
        set({ authLoading: true, error: null });

        try {
            const response = await axiosInstance.post(
                "/api/method/frappetrack.api.auth_api.login_custom",
                { username, password }
            );

            console.log("Login response:", response.data);
            console.log("Cookies after login:", document.cookie);

            if (response.data?.message?.success) {
                set({
                    isAuthenticated: true,
                    authLoading: false,
                    user: response.data.message.user
                });
                const sid = response.data.message.user.sid;
                window.auth.setSid(sid)
                toast.success(response.data.message.message);
                return response.data;
            }

            set({
                error: response.data?.message?.message || "Invalid credentials",
                authLoading: false,
            });
            return false;

        } catch (err) {
            console.error("Login error:", err);
            set({
                error: "Unable to login.",
                authLoading: false,
            });
            return false;
        }
    },

    fetchProfile: async () => {
        try {
            console.log("Cookies before profile fetch:", document.cookie);

            const { data } = await axios.post(
                "/api/method/frappetrack.api.user.get_employee_profile",
                {},
                { withCredentials: true }
            );

            console.log("Profile response:", data);

            if (data?.message?.success) {
                set({ user: data.message.user });
            }

            return data;
        } catch (err) {
            console.error("Profile fetch failed:", err);
        }
    },

    logout: async () => {
        set({ user: null, isAuthenticated: false });
    },
}));