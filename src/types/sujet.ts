// src/types/sujet.ts
export type SujetStatut = "Brouillon" | "Publié" | "Clos";

// NOUVEAU — type de candidat visé par le sujet
export type TypeCandidatSujet = "PFA" | "PFE" | "PFA et PFE";

export interface Sujet {
  id: number;
  titre: string;
  description?: string;
  departement: string;
  typeCandidat: TypeCandidatSujet; // NOUVEAU
  encadrantId: number;
  encadrantName: string;
  technologies: string[];
  statut: SujetStatut;
  nombreCandidatures: number;
  sujetsSimilaires?: { id: number; titre: string; score: number }[];
}

// MODIFIÉ — typeCandidat ajouté, optionnel (valeur par défaut serveur si absent)
export interface CreateSujetPayload {
  titre: string;
  description?: string;
  departement: string;
  typeCandidat?: TypeCandidatSujet; // NOUVEAU
  encadrantId: number;
  encadrantName: string;
  technologies: string[];
  statut: SujetStatut;
}