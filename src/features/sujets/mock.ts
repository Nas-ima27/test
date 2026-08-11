import { Sujet } from "@/types/sujet";

export const mockSujets: Sujet[] = [
  { id: 1, titre: "Application de gestion des vols et des escales", departement: "Systèmes d'Information", encadrantId: 1, encadrantName: "Karima Alaoui", technologies: ["React", "NestJS", "PostgreSQL"], statut: "Publié", nombreCandidatures: 6 },
  { id: 2, titre: "Modèle prédictif de la demande client avec LSTM", departement: "Data & Analytics", encadrantId: 2, encadrantName: "Youssef Benali", technologies: ["Python", "TensorFlow"], statut: "Publié", nombreCandidatures: 4, sujetsSimilaires: [{ id: 101, titre: "Prévision de la demande – modèle ARIMA", score: 0.82 }] },
  { id: 3, titre: "Tableau de bord RH consolidé — Migration Power BI", departement: "Finance", encadrantId: 3, encadrantName: "Nadia Chraibi", technologies: ["Power BI", "SQL"], statut: "Publié", nombreCandidatures: 3 },
  { id: 4, titre: "Portail interne de gestion des congés", departement: "Ressources Humaines", encadrantId: 4, encadrantName: "Hassan Oulhaj", technologies: ["Vue.js", "NodeJS"], statut: "Brouillon", nombreCandidatures: 0 },
  { id: 5, titre: "Automatisation du reporting campagnes marketing", departement: "Marketing", encadrantId: 5, encadrantName: "Salma Tahiri", technologies: ["Python", "n8n"], statut: "Publié", nombreCandidatures: 5 },
  { id: 6, titre: "Optimisation de la chaîne logistique par simulation", departement: "Opérations", encadrantId: 6, encadrantName: "Mehdi Fassi", technologies: ["Java", "Docker"], statut: "Publié", nombreCandidatures: 2 },
];
