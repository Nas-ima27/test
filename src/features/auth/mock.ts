// src/features/auth/mock.ts
import { AuthUser } from "@/types/auth";

// Mode démo uniquement — le mot de passe ne sera jamais géré ainsi côté backend réel
export const mockCredentials: { email: string; password: string; user: AuthUser }[] = [
  {
    email: "yasmine.bennani@sgas.ma", // reprend l'admin déjà présent dans mockUsers
    password: "admin123",
    user: { id: 0, name: "Yasmine Bennani", email: "yasmine.bennani@sgas.ma", role: "Admin", initials: "YB", mustChangePassword: false },
  },
  {
    email: "karima.alaoui@sgas.ma", // correspond à mockEncadrants id 1
    password: "encadrant123",
    user: { id: 1, name: "Dr. Karima Alaoui", email: "karima.alaoui@sgas.ma", role: "Encadrant", initials: "KA", mustChangePassword: false },
  },
  {
    email: "sara.elamrani@emi.ac.ma", // correspond à mockStagiaires id 1
    password: "stagiaire123",
    user: { id: 1, name: "Sara El Amrani", email: "sara.elamrani@emi.ac.ma", role: "Stagiaire", initials: "SE", mustChangePassword: false },
  },
];
