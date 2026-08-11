export type UserRole = "Administrateur" | "Stagiaire" | "Encadrant" | "RH";
export type UserStatus = "Actif" | "Inactif" | "Suspendu";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  service: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  service: string;
  role: UserRole;
  status: UserStatus;
}
