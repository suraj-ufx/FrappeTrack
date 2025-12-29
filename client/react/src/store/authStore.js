import { create } from "zustand";
import axiosInstance from "../config/api";
import toast from "react-hot-toast";


export const useAuthStore = create((set, get) => ({
    user: null,
    authLoading: false,
    isAuthenticated: false,
    error: null,

    login: async (username, password) => {
        set({ authLoading: true, error: null });

        try {
            const { data } = await axiosInstance.post(
                "/api/method/frappetrack.api.auth_api.login_custom",
                { username, password }
            );

            console.log(data)
            if (data?.message?.success) {
                set({ isAuthenticated: true, authLoading: false });
                toast.success(data.message.message)
                return data;
            }

            set({
                error: data?.message?.message || "Invalid credentials",
                authLoading: false,
            });
            return false;

        } catch (err) {
            set({
                error: "Unable to login. Please check server connection.",
                authLoading: false,
            });
            return false;
        }
    },

    // login: async (usr, pwd) => {
    //     set({ authLoading: true, error: null });

    //     try {
    //         const { data } = await axiosInstance.post(
    //             "api/method/frappetrack.api.auth_api.login_custom",
    //             { usr, pwd }
    //         );

    //         console.log(data)
    //         if (data?.full_name) {
    //             set({ isAuthenticated: true, authLoading: false });
    //             toast.success(data.message)
    //             return true
    //         }

    //         set({
    //             error: data?.message?.message || "Invalid credentials",
    //             authLoading: false,
    //         });
    //         return false;

    //     } catch (err) {
    //         set({
    //             error: "Unable to login. Please check server connection.",
    //             authLoading: false,
    //         });
    //         return false;
    //     }
    // },


    fetchProfile: async () => {
        try {

            const { data } = await axiosInstance.get(
                "/api/method/frappetrack.api.user.get_employee_profile"
            );

            if (data?.message?.success) {
                set({ user: data.message.user });
            }

            return data
        } catch (err) {
            console.error("Profile fetch failed", err);
        }
    },

    logout: () => {
        set({ user: null, isAuthenticated: false });
    },
}));
