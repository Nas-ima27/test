// src/types/stagiaire.ts
export type StagiaireStatut = "À venir" | "En cours" | "Terminé";

export type RapportStagiaireStatut = "Non déposé" | "En attente" | "Corrections demandées" | "Validé";

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
  departement: string;
  encadrantId: number | null;
  encadrantName: string | null;
  dateDebut: string;
  dateFin: string;
  avancement: number;
  statut: StagiaireStatut;
  rapportStatut: RapportStagiaireStatut;
  rapportFichierNom?: string;
  rapportFichierUrl?: string | null; // NOUVEAU — URL S3/MinIO du fichier réellement uploadé
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
  departement: string;
  encadrantId: number | null;
  dateDebut: string;
  dateFin: string;
}