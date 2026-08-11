// src/types/auth.ts
export type AppRole = "Admin" | "Encadrant" | "Stagiaire";

export interface AuthUser {
  id: number;           // id de l'entité liée (Encadrant.id ou Stagiaire.id), 0 pour Admin
  name: string;
  email: string;
  role: AppRole;
  initials: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}