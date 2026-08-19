// src/types/stagiaire.ts
export type StagiaireStatut = "À venir" | "En cours" | "Terminé";

export type RapportStagiaireStatut = "Non déposé" | "En attente" | "Corrections demandées" | "Validé";

// NOUVEAU — type de stage
export type TypeStage = "PFA" | "PFE";

export interface Stagiaire {
  id: number;
  name: string;
  email: string;
  telephone?: string;
  linkedin?: string;
  github?: string;
  bio?: string;
  ecole: string;
  filiere: string;
  typeStage: TypeStage; // NOUVEAU
  departement: string;
  encadrantId: number | null;
  encadrantName: string | null;
  dateDebut: string;
  dateFin: string;
  avancement: number;
  statut: StagiaireStatut;
  rapportStatut: RapportStagiaireStatut;
  rapportFichierNom?: string;
  rapportFichierUrl?: string | null;
  rapportDateDepot?: string;
  rapportCommentaire?: string;
  sujetId?: number;
  compteActif: boolean;
}

export interface CreateStagiairePayload {
  name: string;
  email: string;
  ecole: string;
  filiere: string;
  typeStage: TypeStage; // NOUVEAU — obligatoire, exigé par le backend
  departement: string;
  encadrantId: number | null;
  dateDebut: string;
  dateFin: string;
}