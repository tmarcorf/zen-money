import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { userService } from "@/services/userService";
import type { ApiResponse } from "@/types/api";
import type { TokenModel, UserModel } from "@/types/entities";
import { toast } from "sonner";

interface AuthContextType {
  user: UserModel | null;
  loading: boolean;
  /** 'loading' = initial session check in progress; 'checked' = verified with server */
  sessionStatus: "loading" | "checked";
  login: (email: string, password: string) => Promise<ApiResponse<TokenModel>>;
  logout: () => void;
  authenticated: boolean;
  register: (userData: { email: string; password: string; firstName: string; lastName: string; dateOfBirth: string }) => Promise<UserModel | void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<"loading" | "checked">("loading");

  const login = useCallback(async (email: string, password: string): Promise<ApiResponse<TokenModel>> => {
    setLoading(true);
    try {
      const response = await userService.authenticate({ email, password });

      if (response.isSuccess) {
        // The JWT is now set as an HttpOnly cookie by the backend — we don't touch it.
        // Fetch the full user profile to populate the auth state.
        try {
          const meResponse = await userService.getMe();
          if (meResponse.isSuccess && meResponse.data) {
            setUser(meResponse.data);
          } else {
            // getMe returned a non-success response (e.g. 401) — fall back to minimal user
            setUser({
              id: "",
              email: response.data.email,
              firstName: response.data.firstName,
              lastName: "",
              dateOfBirth: "",
            });
          }
        } catch {
          // Network error calling getMe — fall back to minimal user so the user can proceed
          setUser({
            id: "",
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: "",
            dateOfBirth: "",
          });
        }
        setSessionStatus("checked");
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
        throw new Error(response.error?.message || "Falha ao criar conta");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Tell the server to clear the HttpOnly cookie
      await userService.logout();
    } catch {
      // Even if the server call fails, clear local state and redirect
    }
    setUser(null);
    window.location.href = "/login";
  }, []);

  // On mount: check if there is an active session via the HttpOnly cookie
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await userService.getMe();
        if (response.isSuccess && response.data) {
          setUser(response.data);
        }
      } catch {
        // No active session or backend unreachable — stay unauthenticated
      } finally {
        setSessionStatus("checked");
      }
    };

    checkSession();
  }, []);

  // Listen for the global auth:logout event dispatched by the HTTP client on 401 responses
  useEffect(() => {
    const handleAuthLogout = () => {
      setUser(null);
      window.location.href = "/login";
    };

    window.addEventListener("auth:logout", handleAuthLogout);
    return () => window.removeEventListener("auth:logout", handleAuthLogout);
  }, []);

  const authenticated = sessionStatus === "checked" && !!user;

  return (
    <AuthContext.Provider value={{ user, loading, sessionStatus, login, logout, authenticated, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be within AuthProvider");
  return ctx;
}
