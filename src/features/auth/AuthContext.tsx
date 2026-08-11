// src/features/auth/AuthContext.tsx
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { AuthUser, LoginCredentials } from "@/types/auth";
import { mockCredentials } from "./mock";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
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
    // TODO: remplacer par un appel réel à apiClient.post("/auth/login", ...) une fois le backend NestJS disponible
    const match = mockCredentials.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );

    if (!match) {
      return { success: false, error: "E-mail ou mot de passe incorrect." };
    }

    setUser(match.user);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(match.user));
    sessionStorage.setItem("sgas_token", "mock-token"); // pour rester cohérent avec apiClient.ts
    return { success: true };
  }

  function logout() {
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem("sgas_token");
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  return ctx;
}