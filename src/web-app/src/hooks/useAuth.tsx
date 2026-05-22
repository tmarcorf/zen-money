import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { setToken, removeToken, isAuthenticated, getStoredUser, setStoredUser } from "@/services/api";
import { ApiResponse, authService, AuthUserRequest, TokenModel, UserModel } from "@/services/authService";
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserModel | null>(getStoredUser());
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string): Promise<ApiResponse<TokenModel>> => {
    setLoading(true);
    
    try {
      const request: AuthUserRequest = { email, password };
      const response = await authService.authenticate(request);

      if (response.isSuccess) {
        setToken(response.data.token);
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
      const response = await authService.createUser(userData);

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

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated() && !user) {
        try {
          const response = await authService.validateToken();
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
