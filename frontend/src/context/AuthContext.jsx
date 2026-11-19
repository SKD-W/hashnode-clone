import { useState } from "react";
import API from "../api/axios";
import { AuthContext } from "./useAuth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("userInfo");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    localStorage.setItem("userInfo", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, username, email, password) => {
    const { data } = await API.post("/auth/register", {
      name,
      username,
      email,
      password,
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    const merged = { ...user, ...updatedFields };
    localStorage.setItem("userInfo", JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
