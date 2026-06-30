import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AdminAuthContext = createContext();

const STORAGE_KEY = "ak_herbal_admin";

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (admin) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(admin));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [admin]);

  const login = async (email, password) => {
    const { data } = await api.post("/admin/login", { email, password });
    setAdmin(data);
    return data;
  };

  const logout = () => setAdmin(null);

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return context;
};
