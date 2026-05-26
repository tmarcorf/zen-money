import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { setToken, removeToken, isAuthenticated } from "@/api/client";
import { userService } from "@/services/userService";
import type { ApiResponse } from "@/types/api";
import type { TokenModel, UserModel } from "@/types/entities";
import { toast } from "sonner";

interface AuthContextType {
  user: UserModel | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<ApiResponse<TokenModel>>;
  logout: () => void;
  authenticated: boolean;
  register: (userData: { email: string; password: string; firstName: string; lastName: string; dateOfBirth: string }) => Promise<UserModel | void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getStoredUser(): UserModel | null {
  const u = localStorage.getItem("zen_user");
  return u ? JSON.parse(u) : null;
}

function setStoredUser(user: UserModel): void {
  localStorage.setItem("zen_user", JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserModel | null>(getStoredUser());
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string): Promise<ApiResponse<TokenModel>> => {
    setLoading(true);
    try {
      const response = await userService.authenticate({ email, password });

      if (response.isSuccess) {
        setToken(response.data.token);
        setStoredUser({
          id: "",
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: "",
          dateOfBirth: "",
        });
      } else {
        removeToken();
        localStorage.removeItem("zen_user");
        setUser(null);
      }

      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: { email: string; password: string; firstName: string; lastName: string; dateOfBirth: string }) => {
    setLoading(true);
    try {
      const response = await userService.create(userData);

      if (response.isSuccess && response.data) {
        toast.success("Conta criada com sucesso! Faça login para continuar.");
        return response.data;
      } else {
        throw new Error(response.errors?.[0]?.message || "Falha ao criar conta");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    localStorage.removeItem("zen_user");
    setUser(null);
    window.location.href = "/login";
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated() && !user) {
        try {
          const response = await userService.validateToken();
          if (!response.isSuccess) {
            logout();
          }
        } catch {
          logout();
        }
      }
    };

    checkAuth();
  }, [user, logout]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, authenticated: isAuthenticated() && !!user, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be within AuthProvider");
  return ctx;
}
