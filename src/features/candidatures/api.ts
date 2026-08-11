// src/features/candidatures/api.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { Candidature, CandidatureStatut, CreateCandidaturePayload } from "@/types/candidature"; // MODIFIÉ — ajout CreateCandidaturePayload
import { mockCandidatures } from "./mock";

const USE_MOCK = true; // TODO: passer à false une fois le backend NestJS /candidatures disponible

async function fetchCandidatures(): Promise<Candidature[]> {
  if (USE_MOCK) return Promise.resolve(mockCandidatures);
  const { data } = await apiClient.get<Candidature[]>("/candidatures");
  return data;
}

async function updateCandidatureStatus(id: number, statut: CandidatureStatut): Promise<Candidature> {
  if (USE_MOCK) {
    const index = mockCandidatures.findIndex((c) => c.id === id); // CORRIGÉ — findIndex + réécriture réelle du tableau
    mockCandidatures[index] = { ...mockCandidatures[index], statut };
    return Promise.resolve(mockCandidatures[index]);
  }
  const { data } = await apiClient.patch<Candidature>(`/candidatures/${id}`, { statut });
  return data;
}

// NOUVEAU — le stagiaire candidate à un sujet
async function createCandidature(payload: CreateCandidaturePayload): Promise<Candidature> {
  if (USE_MOCK) {
    const created: Candidature = {
      id: Date.now(),
      statut: "En attente",
      dateCandidature: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
      ...payload,
    };
    mockCandidatures.push(created);
    return Promise.resolve(created);
  }
  const { data } = await apiClient.post<Candidature>("/candidatures", payload);
  return data;
}

export function useCandidatures() {
  return useQuery({ queryKey: ["candidatures"], queryFn: fetchCandidatures });
}

export function useUpdateCandidatureStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, statut }: { id: number; statut: CandidatureStatut }) => updateCandidatureStatus(id, statut),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["candidatures"] }),
  });
}

// NOUVEAU
export function useCreateCandidature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCandidature,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["candidatures"] }),
  });
}