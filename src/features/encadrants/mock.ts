// src/features/encadrants/mock.ts
import { Encadrant } from "@/types/encadrant";

export const mockEncadrants: Encadrant[] = [
  { id: 1, name: "Dr. Karima Alaoui", title: "Chef de Projet SI", departement: "Systèmes d'Information", email: "karima.alaoui@sgas.ma", telephone: "05 22 11 22 33", stagiairesActifs: 3, totalEncadres: 18, sujetsProposes: 7, compteActif: true },
  { id: 2, name: "M. Youssef Benali", title: "Data Lead", departement: "Data & Analytics", email: "youssef.benali@sgas.ma", telephone: "05 22 22 33 44", stagiairesActifs: 2, totalEncadres: 12, sujetsProposes: 5, compteActif: true },
  { id: 3, name: "Mme. Nadia Chraibi", title: "Responsable Contrôle de Gestion", departement: "Finance", email: "nadia.chraibi@sgas.ma", telephone: "05 22 33 44 55", stagiairesActifs: 1, totalEncadres: 8, sujetsProposes: 3, compteActif: true },
  { id: 4, name: "M. Hassan Oulhaj", title: "DRH Adjoint", departement: "Ressources Humaines", email: "hassan.oulhaj@sgas.ma", telephone: "05 22 44 55 66", stagiairesActifs: 2, totalEncadres: 10, sujetsProposes: 4, compteActif: true },
  { id: 5, name: "Mme. Salma Tahiri", title: "Marketing Manager", departement: "Marketing", email: "salma.tahiri@sgas.ma", telephone: "05 22 55 66 77", stagiairesActifs: 1, totalEncadres: 6, sujetsProposes: 2, compteActif: false },
  { id: 6, name: "M. Mehdi Fassi", title: "Responsable Opérations", departement: "Opérations", email: "mehdi.fassi@sgas.ma", telephone: "05 22 66 77 88", stagiairesActifs: 2, totalEncadres: 9, sujetsProposes: 4, compteActif: true },
];