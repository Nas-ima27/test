// src/types/candidature.ts
export type CandidatureStatut = "En attente" | "Acceptée" | "Refusée";

export interface Candidature {
  id: number;
  candidatName: string;
  candidatEmail: string;
  stagiaireId: number; // NOUVEAU — le backend le renvoie et l'exige à la création
  sujetId: number;
  sujetTitre: string;
  ecole: string;
  cvUrl?: string;
  statut: CandidatureStatut;
  dateCandidature: string;
}

// MODIFIÉ — stagiaireId ajouté, obligatoire côté backend
export interface CreateCandidaturePayload {
  candidatName: string;
  candidatEmail: string;
  stagiaireId: number; // NOUVEAU
  sujetId: number;
  sujetTitre: string;
  ecole: string;
  cvUrl?: string;
}