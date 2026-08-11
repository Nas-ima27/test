import { User } from "@/types/user";

export const mockUsers: User[] = [
  { id: 1, firstName: "Yasmine", lastName: "Bennani", email: "yasmine.bennani@sgas.ma", service: "Direction générale", role: "Administrateur", status: "Actif", createdAt: "11 févr. 2024" },
  { id: 2, firstName: "Karim", lastName: "El Amrani", email: "karim.elamrani@sgas.ma", service: "Ressources humaines", role: "Stagiaire", status: "Actif", createdAt: "04 mars 2024" },
  { id: 3, firstName: "Salma", lastName: "Chraibi", email: "salma.chraibi@sgas.ma", service: "Finances", role: "Encadrant", status: "Actif", createdAt: "18 avr. 2024" },
  { id: 4, firstName: "Reda", lastName: "Ouazzani", email: "reda.ouazzani@sgas.ma", service: "Support administratif", role: "RH", status: "Actif", createdAt: "22 mai 2024" },
  { id: 5, firstName: "Nadia", lastName: "Fassi", email: "nadia.fassi@sgas.ma", service: "Support administratif", role: "RH", status: "Inactif", createdAt: "09 juin 2024" },
  { id: 6, firstName: "Hamza", lastName: "Tazi", email: "hamza.tazi@sgas.ma", service: "Logistique", role: "Administrateur", status: "Actif", createdAt: "15 juil. 2024" },
];
