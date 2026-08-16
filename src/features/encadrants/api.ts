// src/features/encadrants/api.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { CreateEncadrantPayload, Encadrant } from "@/types/encadrant"; // CORRIGÉ — on réutilise le vrai type, plus de redéfinition locale
import { mockEncadrants } from "./mock";

const USE_MOCK = false; // backend NestJS /encadrants branché // TODO: passer à false une fois le backend NestJS /encadrants disponible

async function fetchEncadrants(): Promise<Encadrant[]> {
  if (USE_MOCK) return Promise.resolve(mockEncadrants);
  const { data } = await apiClient.get<Encadrant[]>("/encadrants");
  return data;
}

async function fetchEncadrantById(id: number): Promise<Encadrant | undefined> {
  if (USE_MOCK) return Promise.resolve(mockEncadrants.find((e) => e.id === id));
  const { data } = await apiClient.get<Encadrant>(`/encadrants/${id}`);
  return data;
}

async function createEncadrant(payload: CreateEncadrantPayload): Promise<Encadrant> {
  if (USE_MOCK) {
    const created: Encadrant = {
      id: Date.now(),
      stagiairesActifs: 0,
      totalEncadres: 0,
      sujetsProposes: 0,
      compteActif: true,
      ...payload,
    };
    mockEncadrants.push(created); // CORRIGÉ — sans ça, le nouvel encadrant n'apparaît jamais dans la liste après invalidation
    return Promise.resolve(created);
  }
  const { data } = await apiClient.post<Encadrant>("/encadrants", payload);
  return data;
}

async function updateEncadrant(id: number, payload: CreateEncadrantPayload): Promise<Encadrant> {
  if (USE_MOCK) {
    const index = mockEncadrants.findIndex((e) => e.id === id);
    mockEncadrants[index] = { ...mockEncadrants[index], ...payload }; // CORRIGÉ — mutation réelle du tableau
    return Promise.resolve(mockEncadrants[index]);
  }
  const { data } = await apiClient.patch<Encadrant>(`/encadrants/${id}`, payload);
  return data;
}

// CORRIGÉ — c'est ce fix qui règle ton problème de toggle qui ne changeait rien
async function toggleEncadrantActive(id: number, compteActif: boolean): Promise<Encadrant> {
  if (USE_MOCK) {
    const index = mockEncadrants.findIndex((e) => e.id === id);
    mockEncadrants[index] = { ...mockEncadrants[index], compteActif };
    return Promise.resolve(mockEncadrants[index]);
  }
  const { data } = await apiClient.patch<Encadrant>(`/encadrants/${id}`, { compteActif });
  return data;
}

export function useEncadrants() {
  return useQuery({ queryKey: ["encadrants"], queryFn: fetchEncadrants });
}

export function useEncadrant(id: number) {
  return useQuery({ queryKey: ["encadrants", id], queryFn: () => fetchEncadrantById(id) });
}

export function useCreateEncadrant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEncadrant,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["encadrants"] }),
  });
}

export function useUpdateEncadrant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateEncadrantPayload }) => updateEncadrant(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["encadrants"] }),
  });
}

export function useToggleEncadrantActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, compteActif }: { id: number; compteActif: boolean }) => toggleEncadrantActive(id, compteActif),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["encadrants"] }),
  });
}