// src/types/tache.ts
export type TacheStatut = "À faire" | "Faite";

export interface Tache {
  id: number;
  stagiaireId: number;
  titre: string;
  description: string | null;
  statut: TacheStatut;
  createdAt: string;
}

export interface CreateTachePayload {
  stagiaireId: number;
  titre: string;
  description?: string;
}
