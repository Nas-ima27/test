// src/types/candidature.ts
export type CandidatureStatut = "En attente" | "Acceptée" | "Refusée";

export interface Candidature {
  id: number;
  candidatName: string;
  candidatEmail: string;
  sujetId: number;
  sujetTitre: string;
  ecole: string;
  cvUrl?: string;
  statut: CandidatureStatut;
  dateCandidature: string;
}

// NOUVEAU — ce que le stagiaire envoie en candidatant à un sujet
export interface CreateCandidaturePayload {
  candidatName: string;
  candidatEmail: string;
  sujetId: number;
  sujetTitre: string;
  ecole: string;
  cvUrl?: string;
}