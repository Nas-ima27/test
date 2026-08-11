// src/features/stagiaires/journal/mock.ts
import { JournalEntry } from "@/types/journal";

export const mockJournalEntries: JournalEntry[] = [
  {
    id: 1,
    stagiaireId: 1, // Sara El Amrani
    type: "Journalier",
    date: "05 févr. 2025",
    contenu: "Mise en place de l'architecture du module d'authentification (JWT + guards NestJS). Rédaction des tests unitaires pour le service de login.",
  },
  {
    id: 2,
    stagiaireId: 1,
    type: "Journalier",
    date: "06 févr. 2025",
    contenu: "Intégration du formulaire de connexion côté frontend. Correction d'un bug sur le rafraîchissement du token.",
  },
  {
    id: 3,
    stagiaireId: 1,
    type: "Hebdomadaire",
    date: "07 févr. 2025",
    contenu: "Semaine consacrée à l'authentification : backend (JWT, guards, refresh token) et frontend (formulaire, gestion de session) terminés à 90%. Reste à traiter la déconnexion automatique en cas d'expiration.",
  },
];