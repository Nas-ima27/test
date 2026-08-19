// src/features/sujets/api.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { CreateSujetPayload, Sujet, SujetStatut } from "@/types/sujet"; // MODIFIÉ — ajout SujetStatut
import { mockSujets } from "./mock";

const USE_MOCK = false; // backend NestJS /sujets branché // TODO: passer à false une fois le backend NestJS /sujets disponible

async function fetchSujets(): Promise<Sujet[]> {
  if (USE_MOCK) return Promise.resolve(mockSujets);
  const { data } = await apiClient.get<Sujet[]>("/sujets");
  return data;
}

async function fetchSujetById(id: number): Promise<Sujet | undefined> {
  if (USE_MOCK) return Promise.resolve(mockSujets.find((s) => s.id === id));
  const { data } = await apiClient.get<Sujet>(`/sujets/${id}`);
  return data;
}

export async function checkSujetSimilarity(titre: string, description: string) {
  const { data } = await apiClient.post<{ id: number; titre: string; score: number }[]>(
    "/sujets/similarity-check",
    { titre, description }
  );
  return data;
}

async function createSujet(payload: CreateSujetPayload): Promise<Sujet> {
  if (USE_MOCK) {
    const created: Sujet = {
      id: Date.now(),
      nombreCandidatures: 0,
      ...payload,
      typeCandidat: payload.typeCandidat ?? "PFA et PFE",
    };
    mockSujets.push(created);
    return Promise.resolve(created);
  }
  const { data } = await apiClient.post<Sujet>("/sujets", payload);
  return data;
}

// NOUVEAU — modifier un sujet existant (titre, description, technologies...)
async function updateSujet(id: number, payload: CreateSujetPayload): Promise<Sujet> {
  if (USE_MOCK) {
    const index = mockSujets.findIndex((s) => s.id === id);
    mockSujets[index] = { ...mockSujets[index], ...payload };
    return Promise.resolve(mockSujets[index]);
  }
  const { data } = await apiClient.patch<Sujet>(`/sujets/${id}`, payload);
  return data;
}

// NOUVEAU — changer uniquement le statut (Publié ↔ Brouillon/Clos), pour "Dépublier"
async function updateSujetStatut(id: number, statut: SujetStatut): Promise<Sujet> {
  if (USE_MOCK) {
    const index = mockSujets.findIndex((s) => s.id === id);
    mockSujets[index] = { ...mockSujets[index], statut };
    return Promise.resolve(mockSujets[index]);
  }
  const { data } = await apiClient.patch<Sujet>(`/sujets/${id}`, { statut });
  return data;
}

export function useSujets() {
  return useQuery({ queryKey: ["sujets"], queryFn: fetchSujets });
}

export function useSujet(id: number) {
  return useQuery({ queryKey: ["sujets", id], queryFn: () => fetchSujetById(id) });
}

export function useCreateSujet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSujet,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sujets"] }),
  });
}

// NOUVEAU
export function useUpdateSujet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateSujetPayload }) => updateSujet(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sujets"] }),
  });
}

// NOUVEAU
export function useUpdateSujetStatut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, statut }: { id: number; statut: SujetStatut }) => updateSujetStatut(id, statut),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sujets"] }),
  });
}