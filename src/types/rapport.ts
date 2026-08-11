export type RapportStatut = "En attente de validation" | "Corrections demandées" | "Validé";

export interface Rapport {
  id: number;
  titre: string;
  resume: string;
  auteur: string;
  ecole: string;
  encadrant: string;
  departement: string;
  technologies: string[];
  annee: number;
  statut: RapportStatut;
  dateValidation?: string;
  fichierUrl?: string;
}
