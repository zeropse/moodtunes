"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("moodtunes_user");
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (e) {
          console.error("Failed to parse user data", e);
          localStorage.removeItem("moodtunes_user");
        }
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (email, password) => {
    // Mock login
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          // Simulate a simple check
          if (password.length < 6) {
            reject(new Error("Password must be at least 6 characters"));
            return;
          }
          const mockUser = { id: "1", email, name: email.split("@")[0] };
          setUser(mockUser);
          localStorage.setItem("moodtunes_user", JSON.stringify(mockUser));
          resolve(mockUser);
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 800);
    });
  };

  const signup = async (name, email, password) => {
    // Mock signup
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password && name) {
          if (password.length < 6) {
            reject(new Error("Password must be at least 6 characters"));
            return;
          }
          const mockUser = { id: "1", email, name };
          setUser(mockUser);
          localStorage.setItem("moodtunes_user", JSON.stringify(mockUser));
          resolve(mockUser);
        } else {
          reject(new Error("Please fill in all fields"));
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("moodtunes_user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
