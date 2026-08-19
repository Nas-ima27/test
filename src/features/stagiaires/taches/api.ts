// src/features/stagiaires/taches/api.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { CreateTachePayload, Tache, TacheStatut } from "@/types/tache";

async function fetchTaches(stagiaireId: number): Promise<Tache[]> {
  const { data } = await apiClient.get<Tache[]>(`/stagiaires/${stagiaireId}/taches`);
  return data;
}

async function createTache(payload: CreateTachePayload): Promise<Tache> {
  // stagiaireId vient de l'URL, pas du body (même contrat que /journal).
  const { stagiaireId, ...body } = payload;
  const { data } = await apiClient.post<Tache>(`/stagiaires/${stagiaireId}/taches`, body);
  return data;
}

interface UpdateTacheStatutPayload {
  stagiaireId: number;
  tacheId: number;
  statut: TacheStatut;
}

async function updateTacheStatut(payload: UpdateTacheStatutPayload): Promise<Tache> {
  const { data } = await apiClient.patch<Tache>(
    `/stagiaires/${payload.stagiaireId}/taches/${payload.tacheId}`,
    { statut: payload.statut }
  );
  return data;
}

export function useTaches(stagiaireId: number) {
  return useQuery({
    queryKey: ["taches", stagiaireId],
    queryFn: () => fetchTaches(stagiaireId),
  });
}

export function useCreateTache() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTache,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["taches", variables.stagiaireId] });
    },
  });
}

export function useUpdateTacheStatut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTacheStatut,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["taches", variables.stagiaireId] });
    },
  });
}
