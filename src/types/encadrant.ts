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
  // Présent UNIQUEMENT dans la réponse de POST /encadrants (jamais sur
  // GET) — mot de passe par défaut du compte de connexion créé en même
  // temps que la fiche, à communiquer à l'encadrant (pas d'email
  // automatique, voir EncadrantsService.create côté backend).
  tempPassword?: string;
}

// AJOUTÉ — n'existait pas du tout dans ton fichier
export interface CreateEncadrantPayload {
  name: string;
  title: string;
  departement: string;
  email: string;
}