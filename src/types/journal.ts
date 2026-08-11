// src/types/journal.ts
export type JournalType = "Journalier" | "Hebdomadaire";

export interface JournalEntry {
  id: number;
  stagiaireId: number;
  type: JournalType;
  date: string;        // date du compte rendu (ou fin de la semaine concernée)
  contenu: string;      // tâches réalisées / avancement
}

export interface CreateJournalEntryPayload {
  stagiaireId: number;
  type: JournalType;
  contenu: string;
}