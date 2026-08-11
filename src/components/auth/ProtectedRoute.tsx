// src/components/auth/ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { AppRole } from "@/types/auth";

const ROLE_HOME: Record<AppRole, string> = {
  Admin: "/",
  Encadrant: "/espace-encadrant",
  Stagiaire: "/espace-stagiaire",
};

interface ProtectedRouteProps {
  allowedRoles: AppRole[];
  children: ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-slate-400">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Connecté, mais mauvais rôle pour cet espace — on le renvoie chez lui plutôt qu'un simple message d'erreur
    return <Navigate to={ROLE_HOME[user.role]} replace />;
  }

  return <>{children}</>;
}