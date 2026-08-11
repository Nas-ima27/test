import { Rapport } from "@/types/rapport";

export const mockRapports: Rapport[] = [
  {
    id: 1,
    titre: "Application de gestion des vols et des escales – Architecture React/NestJS",
    resume:
      "Développement d'une plateforme web complète pour la gestion opérationnelle des vols internes, intégrant la planification des escales, la gestion des équipages et le suivi temps réel.",
    auteur: "Mehdi Fassi",
    ecole: "HEC Paris",
    encadrant: "Mme. Salma Tahiri",
    departement: "Systèmes d'Information",
    technologies: ["React", "NestJS", "PostgreSQL", "Docker"],
    annee: 2024,
    statut: "Validé",
    dateValidation: "20/11/2024",
  },
  {
    id: 2,
    titre: "Modèle prédictif de la demande client avec LSTM",
    resume:
      "Conception d'un modèle de séries temporelles pour anticiper la demande client sur plusieurs horizons, avec un pipeline de ré-entraînement automatisé.",
    auteur: "Yassine Benali",
    ecole: "INSEA",
    encadrant: "M. Youssef Benali",
    departement: "Data & Analytics",
    technologies: ["Python", "TensorFlow", "Pandas"],
    annee: 2024,
    statut: "Validé",
    dateValidation: "02/12/2024",
  },
  {
    id: 3,
    titre: "Tableau de bord RH consolidé – Migration Power BI Premium",
    resume:
      "Migration et consolidation des tableaux de bord RH existants vers Power BI Premium avec optimisation des temps de rafraîchissement.",
    auteur: "Imane Zouak",
    ecole: "ENCG Casablanca",
    encadrant: "Mme. Nadia Chraibi",
    departement: "Finance",
    technologies: ["Power BI", "SQL"],
    annee: 2023,
    statut: "Validé",
    dateValidation: "10/03/2023",
  },
  {
    id: 4,
    titre: "Portail interne de gestion des congés",
    resume:
      "Portail self-service permettant aux employés de déposer et suivre leurs demandes de congés, avec workflow de validation hiérarchique.",
    auteur: "Adam Cherkaoui",
    ecole: "Université Mohammed V",
    encadrant: "M. Hassan Oulhaj",
    departement: "Ressources Humaines",
    technologies: ["Vue.js", "NodeJS", "MongoDB"],
    annee: 2024,
    statut: "Validé",
    dateValidation: "18/06/2024",
  },
];
