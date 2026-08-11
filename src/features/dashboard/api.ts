import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

export interface DashboardStats {
  stagiairesActifs: number;
  sujetsDisponibles: number;
  candidaturesEnAttente: number;
  rapportsArchives: number;
  evolutionMensuelle: { mois: string; stages: number }[];
  parDepartement: { dept: string; count: number }[];
}

const USE_MOCK = true; // TODO: passer à false une fois le backend NestJS /dashboard/stats disponible

const mockStats: DashboardStats = {
  stagiairesActifs: 11,
  sujetsDisponibles: 6,
  candidaturesEnAttente: 2,
  rapportsArchives: 4,
  evolutionMensuelle: [
    { mois: "Fév", stages: 4 },
    { mois: "Mar", stages: 6 },
    { mois: "Avr", stages: 5 },
    { mois: "Mai", stages: 8 },
    { mois: "Juin", stages: 10 },
    { mois: "Juil", stages: 7 },
  ],
  parDepartement: [
    { dept: "Systèmes d'Info.", count: 4 },
    { dept: "Finance", count: 2 },
    { dept: "Ress. Humaines", count: 3 },
    { dept: "Marketing", count: 2 },
    { dept: "Data & Analytics", count: 3 },
    { dept: "Opérations", count: 2 },
  ],
};

async function fetchDashboardStats(): Promise<DashboardStats> {
  if (USE_MOCK) return Promise.resolve(mockStats);
  const { data } = await apiClient.get<DashboardStats>("/dashboard/stats");
  return data;
}

export function useDashboardStats() {
  return useQuery({ queryKey: ["dashboard-stats"], queryFn: fetchDashboardStats });
}
