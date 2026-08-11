import { Candidature } from "@/types/candidature";

export const mockCandidatures: Candidature[] = [
  { id: 1, candidatName: "Yasmine Ait Ali", candidatEmail: "yasmine.aitali@emi.ac.ma", sujetId: 1, sujetTitre: "Application de gestion des vols et des escales", ecole: "EMI", statut: "En attente", dateCandidature: "12 juil. 2026" },
  { id: 2, candidatName: "Othmane Bekkali", candidatEmail: "othmane.bekkali@insea.ac.ma", sujetId: 2, sujetTitre: "Modèle prédictif de la demande client avec LSTM", ecole: "INSEA", statut: "Acceptée", dateCandidature: "08 juil. 2026" },
  { id: 3, candidatName: "Lina Sabir", candidatEmail: "lina.sabir@iscae.ac.ma", sujetId: 5, sujetTitre: "Automatisation du reporting campagnes marketing", ecole: "ISCAE", statut: "Refusée", dateCandidature: "05 juil. 2026" },
  { id: 4, candidatName: "Amine Kadiri", candidatEmail: "amine.kadiri@ensam.ac.ma", sujetId: 6, sujetTitre: "Optimisation de la chaîne logistique par simulation", ecole: "ENSAM", statut: "En attente", dateCandidature: "14 juil. 2026" },
  { id: 5, candidatName: "Nour Belhaj", candidatEmail: "nour.belhaj@encg.ac.ma", sujetId: 3, sujetTitre: "Tableau de bord RH consolidé — Migration Power BI", ecole: "ENCG", statut: "Acceptée", dateCandidature: "01 juil. 2026" },
];
