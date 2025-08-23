"use client";

import { AuthUser } from "@/types";
import { api } from "@/utils/api";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    bio?: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("strongchat_token");
    const storedUser = localStorage.getItem("strongchat_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      console.log("login response ", response.data.data);
      const user = response.data.data.user;
      const token = response.data.data.token;

      // const newToken = "mocked token";
      // const newUser: AuthUser = {
      //   id: "1",
      //   email,
      //   name: "Mocked User",
      //   bio: "This is a mocked user",
      //   avatarUrl: "https://example.com/avatar.png",
      // };

      setToken(token);
      setUser(user);

      localStorage.setItem("strongchat_token", token);
      localStorage.setItem("strongchat_user", JSON.stringify(user));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    bio?: string
  ) => {
    try {
      const response = await api.post("/users/register", {
        email,
        password,
        name,
        bio,
      });
      const user = response.data.data.user;
      const token = response.data.data.token;

      if (user && token) {
        setToken(token);
        setUser(user);

        localStorage.setItem("strongchat_token", token);
        localStorage.setItem("strongchat_user", JSON.stringify(user));

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    } catch (error: any) {
      console.log("registration error ", error.response);
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      const response = await api.put("/users/profile", data);
      const updatedUser = response.data;

      setUser(updatedUser);
      localStorage.setItem("strongchat_user", JSON.stringify(updatedUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Profile update failed");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("strongchat_token");
    localStorage.removeItem("strongchat_user");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
