// src/types/sujet.ts
export type SujetStatut = "Brouillon" | "Publié" | "Clos";

export interface Sujet {
  id: number;
  titre: string;
  description?: string;
  departement: string;
  encadrantId: number;
  encadrantName: string;
  technologies: string[];
  statut: SujetStatut;
  nombreCandidatures: number;
  sujetsSimilaires?: { id: number; titre: string; score: number }[];
}

// NOUVEAU — ce que l'encadrant envoie en proposant un sujet
export interface CreateSujetPayload {
  titre: string;
  description?: string;
  departement: string;
  encadrantId: number;
  encadrantName: string;
  technologies: string[];
  statut: SujetStatut;
}