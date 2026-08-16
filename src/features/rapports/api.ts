import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { Rapport } from "@/types/rapport";
import { mockRapports } from "./mock";

const USE_MOCK = false; // TODO: passer à false une fois le backend NestJS /rapports disponible

async function fetchRapports(): Promise<Rapport[]> {
  if (USE_MOCK) return Promise.resolve(mockRapports);
  const { data } = await apiClient.get<Rapport[]>("/rapports");
  return data;
}

async function fetchRapportById(id: number): Promise<Rapport | undefined> {
  if (USE_MOCK) return Promise.resolve(mockRapports.find((r) => r.id === id));
  const { data } = await apiClient.get<Rapport>(`/rapports/${id}`);
  return data;
}

export function useRapports() {
  return useQuery({ queryKey: ["rapports"], queryFn: fetchRapports });
}

export function useRapport(id: number) {
  return useQuery({ queryKey: ["rapports", id], queryFn: () => fetchRapportById(id) });
}
