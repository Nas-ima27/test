// src/features/stagiaires/api.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { CreateStagiairePayload, RapportStagiaireStatut, Stagiaire } from "@/types/stagiaire";
import { mockStagiaires } from "./mock";

const USE_MOCK = false; // backend NestJS /stagiaires branché

async function fetchStagiaires(): Promise<Stagiaire[]> {
  if (USE_MOCK) return Promise.resolve(mockStagiaires);
  const { data } = await apiClient.get<Stagiaire[]>("/stagiaires");
  return data;
}

async function fetchStagiaireById(id: number): Promise<Stagiaire | undefined> {
  if (USE_MOCK) return Promise.resolve(mockStagiaires.find((s) => s.id === id));
  const { data } = await apiClient.get<Stagiaire>(`/stagiaires/${id}`);
  return data;
}

async function createStagiaire(payload: CreateStagiairePayload): Promise<Stagiaire> {
  if (USE_MOCK) {
    const created: Stagiaire = {
      id: Date.now(),
      avancement: 0,
      statut: "À venir",
      compteActif: true,
      encadrantName: null,
      rapportStatut: "Non déposé",
      ...payload,
    };
    mockStagiaires.push(created);
    return Promise.resolve(created);
  }
  const { data } = await apiClient.post<Stagiaire>("/stagiaires", payload);
  return data;
}

async function updateStagiaire(id: number, payload: CreateStagiairePayload): Promise<Stagiaire> {
  if (USE_MOCK) {
    const index = mockStagiaires.findIndex((s) => s.id === id);
    mockStagiaires[index] = { ...mockStagiaires[index], ...payload };
    return Promise.resolve(mockStagiaires[index]);
  }
  const { data } = await apiClient.patch<Stagiaire>(`/stagiaires/${id}`, payload);
  return data;
}

async function deleteStagiaire(id: number): Promise<void> {
  if (USE_MOCK) {
    const index = mockStagiaires.findIndex((s) => s.id === id);
    if (index !== -1) mockStagiaires.splice(index, 1);
    return Promise.resolve();
  }
  await apiClient.delete(`/stagiaires/${id}`);
}

async function toggleStagiaireActive(id: number, compteActif: boolean): Promise<Stagiaire> {
  if (USE_MOCK) {
    const index = mockStagiaires.findIndex((s) => s.id === id);
    mockStagiaires[index] = { ...mockStagiaires[index], compteActif };
    return Promise.resolve(mockStagiaires[index]);
  }
  const { data } = await apiClient.patch<Stagiaire>(`/stagiaires/${id}`, { compteActif });
  return data;
}

async function assignEncadrant(stagiaireId: number, encadrantId: number, encadrantName: string): Promise<Stagiaire> {
  if (USE_MOCK) {
    const index = mockStagiaires.findIndex((s) => s.id === stagiaireId);
    mockStagiaires[index] = { ...mockStagiaires[index], encadrantId, encadrantName };
    return Promise.resolve(mockStagiaires[index]);
  }
  const { data } = await apiClient.patch<Stagiaire>(`/stagiaires/${stagiaireId}/affectation`, { encadrantId });
  return data;
}

/**
 * MODIFIÉ : prend maintenant le vrai objet File (plus un simple nom de
 * fichier) — le backend attend un multipart/form-data avec la clé EXACTE
 * "file". L'appelant (RapportSection.tsx / useDeposerRapport) doit être
 * mis à jour pour passer le File sélectionné plutôt que son .name.
 */
async function deposerRapport(stagiaireId: number, file: File): Promise<Stagiaire> {
  if (USE_MOCK) {
    const index = mockStagiaires.findIndex((s) => s.id === stagiaireId);
    mockStagiaires[index] = {
      ...mockStagiaires[index],
      rapportStatut: "En attente",
      rapportFichierNom: file.name,
      rapportDateDepot: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
      rapportCommentaire: undefined,
    };
    return Promise.resolve(mockStagiaires[index]);
  }
  const formData = new FormData();
  formData.append("file", file); // clé "file" exacte, sensible à la casse

  const { data } = await apiClient.post<Stagiaire>(
    `/stagiaires/${stagiaireId}/rapport`,
    formData,
    // On NE fixe PAS Content-Type ici : avec un FormData, axios/le
    // navigateur doivent générer eux-mêmes l'en-tête
    // "multipart/form-data; boundary=...". Le forcer à la main (comme
    // avant) écrase le boundary et produit un corps multipart invalide
    // que le backend ne peut pas parser — le dépôt échouait en silence.
    // "Content-Type: undefined" annule ici le défaut JSON de apiClient.
    { headers: { "Content-Type": undefined } }
  );
  return data;
}

async function evaluerRapport(
  stagiaireId: number,
  statut: RapportStagiaireStatut,
  commentaire?: string
): Promise<Stagiaire> {
  if (USE_MOCK) {
    const index = mockStagiaires.findIndex((s) => s.id === stagiaireId);
    mockStagiaires[index] = {
      ...mockStagiaires[index],
      rapportStatut: statut,
      rapportCommentaire: commentaire,
    };
    return Promise.resolve(mockStagiaires[index]);
  }
  const { data } = await apiClient.patch<Stagiaire>(`/stagiaires/${stagiaireId}/rapport/evaluation`, {
    statut,
    commentaire,
  });
  return data;
}

export function useStagiaires() {
  return useQuery({ queryKey: ["stagiaires"], queryFn: fetchStagiaires });
}

export function useStagiaire(id: number) {
  return useQuery({ queryKey: ["stagiaires", id], queryFn: () => fetchStagiaireById(id) });
}

export function useCreateStagiaire() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStagiaire,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stagiaires"] }),
  });
}

export function useUpdateStagiaire() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateStagiairePayload }) => updateStagiaire(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stagiaires"] }),
  });
}

export function useDeleteStagiaire() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStagiaire,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stagiaires"] }),
  });
}

export function useToggleStagiaireActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, compteActif }: { id: number; compteActif: boolean }) => toggleStagiaireActive(id, compteActif),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stagiaires"] }),
  });
}

export function useAssignEncadrant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ stagiaireId, encadrantId, encadrantName }: { stagiaireId: number; encadrantId: number; encadrantName: string }) =>
      assignEncadrant(stagiaireId, encadrantId, encadrantName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stagiaires"] });
      queryClient.invalidateQueries({ queryKey: ["encadrants"] });
    },
  });
}

/**
 * MODIFIÉ : "fichierNom: string" devient "file: File" — le composant
 * appelant doit maintenant passer le File sélectionné dans l'input,
 * pas juste son nom (voir RapportSection.tsx à mettre à jour).
 */
export function useDeposerRapport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ stagiaireId, file }: { stagiaireId: number; file: File }) =>
      deposerRapport(stagiaireId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["stagiaires"] });
      queryClient.invalidateQueries({ queryKey: ["stagiaires", variables.stagiaireId] });
    },
  });
}

interface UpdateStagiaireProfilePayload {
  telephone?: string;
  linkedin?: string;
  github?: string;
  bio?: string;
}

async function updateStagiaireProfile(
  id: number,
  payload: UpdateStagiaireProfilePayload
): Promise<Stagiaire> {
  if (USE_MOCK) {
    const index = mockStagiaires.findIndex((s) => s.id === id);
    mockStagiaires[index] = { ...mockStagiaires[index], ...payload };
    return Promise.resolve(mockStagiaires[index]);
  }
  const { data } = await apiClient.patch<Stagiaire>(`/stagiaires/${id}/profile`, payload);
  return data;
}

export function useUpdateStagiaireProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateStagiaireProfilePayload }) =>
      updateStagiaireProfile(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["stagiaires"] });
      queryClient.invalidateQueries({ queryKey: ["stagiaires", variables.id] });
    },
  });
}

export function useEvaluerRapport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      stagiaireId,
      statut,
      commentaire,
    }: {
      stagiaireId: number;
      statut: RapportStagiaireStatut;
      commentaire?: string;
    }) => evaluerRapport(stagiaireId, statut, commentaire),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["stagiaires"] });
      queryClient.invalidateQueries({ queryKey: ["stagiaires", variables.stagiaireId] });
    },
  });
}