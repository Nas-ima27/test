// src/features/auth/AuthContext.tsx
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { AuthUser, LoginCredentials } from "@/types/auth";
import { mockCredentials } from "./mock";
import { apiClient } from "@/api/client";

// Flag par fichier, cohérent avec le pattern utilisé dans le reste de
// l'app (features/<domaine>/api.ts) — permet de revenir au mock
// facilement pour une démo sans backend, sans toucher au reste du code.
const USE_MOCK = false;

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  // NOUVEAU — met à jour l'utilisateur en session sans repasser par un
  // login. Utilisé après PATCH /auth/change-password pour lever
  // immédiatement le blocage ProtectedRoute (mustChangePassword: false),
  // qui sinon resterait basé sur la valeur figée au moment du login.
  updateUser: (patch: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "sgas_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaure la session au chargement de l'app
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  async function login({ email, password }: LoginCredentials): Promise<{ success: boolean; error?: string }> {
    if (USE_MOCK) {
      const match = mockCredentials.find(
        (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
      );

      if (!match) {
        return { success: false, error: "E-mail ou mot de passe incorrect." };
      }

      setUser(match.user);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(match.user));
      sessionStorage.setItem("sgas_token", "mock-token");
      return { success: true };
    }

    try {
      // Backend : POST /auth/login -> { user: AuthUser, token: string }
      const { data } = await apiClient.post<{ user: AuthUser; token: string }>(
        "/auth/login",
        { email, password }
      );

      setUser(data.user);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      sessionStorage.setItem("sgas_token", data.token);
      return { success: true };
    } catch (error: any) {
      // Le backend renvoie { message, error, statusCode } — message est
      // déjà en français et affichable tel quel (401 identifiants
      // invalides, 403 compte désactivé).
      const message =
        error.response?.data?.message ?? "E-mail ou mot de passe incorrect.";
      return { success: false, error: message };
    }
  }

  function logout() {
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem("sgas_token");
  }

  function updateUser(patch: Partial<AuthUser>) {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  return ctx;
}