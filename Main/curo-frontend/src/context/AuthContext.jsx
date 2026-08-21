/* eslint-disable react/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem("curo_auth_token") || null);
  const [user, setUserState] = useState(() => {
    const u = localStorage.getItem("curo_auth_user");
    if (u) {
      try {
        return JSON.parse(u);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = (userData) => {
    const resolvedUser = {
      userId: userData.userId,
      email: userData.email,
      name: userData.name || "",
      phone: userData.phone || "",
    };

    localStorage.setItem("curo_auth_token", userData.token);
    localStorage.setItem("curo_auth_user", JSON.stringify(resolvedUser));

    setTokenState(userData.token);
    setUserState(resolvedUser);
  };

  const logout = () => {
    localStorage.removeItem("curo_auth_token");
    localStorage.removeItem("curo_auth_user");

    setTokenState(null);
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
