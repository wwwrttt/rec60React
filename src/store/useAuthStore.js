import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isLoading: true,
  isAuthenticated: false,
  user: null,
  accessToken: null,

  setAuth: (data) => set(data),

  clearAuth: () =>
    set({
      isAuthenticated: false,
      user: null,
      accessToken: null
    })
}));
