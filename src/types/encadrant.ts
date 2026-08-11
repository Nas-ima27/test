// src/types/encadrant.ts
export interface Encadrant {
  id: number;
  name: string;
  title: string;
  departement: string;
  email: string;           // MODIFIÉ — n'est plus optionnel (ex: email?)
  telephone?: string;      // AJOUTÉ
  stagiairesActifs: number;
  totalEncadres: number;
  sujetsProposes: number;
  compteActif: boolean;    // AJOUTÉ — nécessaire pour StatusToggle
}

// AJOUTÉ — n'existait pas du tout dans ton fichier
export interface CreateEncadrantPayload {
  name: string;
  title: string;
  departement: string;
  email: string;
}