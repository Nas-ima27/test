// src/types/auth.ts
export type AppRole = "Admin" | "Encadrant" | "Stagiaire";

export interface AuthUser {
  id: number;           // id de l'entité liée (Encadrant.id ou Stagiaire.id), 0 pour Admin
  name: string;
  email: string;
  role: AppRole;
  initials: string;
  // NOUVEAU — true tant que ce compte utilise encore son mot de passe par
  // défaut prévisible (voir backend default-password.util.ts). Bloque
  // toute navigation dans l'app tant que ce n'est pas changé (voir
  // ProtectedRoute.tsx / MandatoryPasswordChangeScreen.tsx).
  mustChangePassword: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}