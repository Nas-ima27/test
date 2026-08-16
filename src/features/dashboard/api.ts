import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

// MODIFIÉ — noms de champs alignés sur la réponse réelle du backend
// (voir BACKEND_SPEC_UPDATED.md §9) :
//   evolutionMensuelle[].stages   -> count
//   parDepartement                -> repartitionParDepartement
//   parDepartement[].dept         -> departement
// + ajout de technologiesLesPlusUtilisees, non exploité auparavant.
export interface DashboardStats {
  stagiairesActifs: number;
  sujetsDisponibles: number;
  candidaturesEnAttente: number;
  rapportsArchives: number;
  evolutionMensuelle: { mois: string; count: number }[];
  repartitionParDepartement: { departement: string; count: number }[];
  technologiesLesPlusUtilisees: { technologie: string; count: number }[];
}

const USE_MOCK = false; // backend NestJS /dashboard/stats branché

const mockStats: DashboardStats = {
  stagiairesActifs: 11,
  sujetsDisponibles: 6,
  candidaturesEnAttente: 2,
  rapportsArchives: 4,
  evolutionMensuelle: [
    { mois: "2026-02", count: 4 },
    { mois: "2026-03", count: 6 },
    { mois: "2026-04", count: 5 },
    { mois: "2026-05", count: 8 },
    { mois: "2026-06", count: 10 },
    { mois: "2026-07", count: 7 },
  ],
  repartitionParDepartement: [
    { departement: "Systèmes d'Info.", count: 4 },
    { departement: "Finance", count: 2 },
    { departement: "Ress. Humaines", count: 3 },
    { departement: "Marketing", count: 2 },
    { departement: "Data & Analytics", count: 3 },
    { departement: "Opérations", count: 2 },
  ],
  technologiesLesPlusUtilisees: [
    { technologie: "React", count: 5 },
    { technologie: "NestJS", count: 4 },
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