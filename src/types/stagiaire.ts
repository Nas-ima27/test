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
  rapportFichierNom?: string;    // NOUVEAU — nom du fichier déposé
  rapportDateDepot?: string;      // NOUVEAU — date du dernier dépôt
  rapportCommentaire?: string;    // NOUVEAU — retour de l'encadrant si corrections demandées
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