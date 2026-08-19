// src/features/stagiaires/journal/api.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { CreateJournalEntryPayload, JournalEntry } from "@/types/journal";
import { mockJournalEntries } from "./mock";

const USE_MOCK = false; // backend NestJS /stagiaires/:id/journal branché

async function fetchJournalEntries(stagiaireId: number): Promise<JournalEntry[]> {
  if (USE_MOCK) {
    return Promise.resolve(
      mockJournalEntries
        .filter((e) => e.stagiaireId === stagiaireId)
        .sort((a, b) => b.id - a.id)
    );
  }
  const { data } = await apiClient.get<JournalEntry[]>(`/stagiaires/${stagiaireId}/journal`);
  return data;
}

async function createJournalEntry(payload: CreateJournalEntryPayload): Promise<JournalEntry> {
  if (USE_MOCK) {
    const created: JournalEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
      ...payload,
    };
    mockJournalEntries.push(created);
    return Promise.resolve(created);
  }
  // MODIFIÉ : stagiaireId ne doit PAS être envoyé dans le body — le
  // backend le lit depuis l'URL (:id) et rejette (400, forbidNonWhitelisted)
  // tout champ non déclaré dans le DTO { type, contenu }.
  const { stagiaireId, ...body } = payload;
  const { data } = await apiClient.post<JournalEntry>(`/stagiaires/${stagiaireId}/journal`, body);
  return data;
}

export function useJournalEntries(stagiaireId: number) {
  return useQuery({
    queryKey: ["journal", stagiaireId],
    queryFn: () => fetchJournalEntries(stagiaireId),
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createJournalEntry,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["journal", variables.stagiaireId] });
    },
  });
}

// NOUVEAU — l'encadrant commente une entrée précise du journal.
interface AddJournalCommentPayload {
  stagiaireId: number;
  entryId: number;
  commentaire: string;
}

async function addJournalComment(payload: AddJournalCommentPayload): Promise<JournalEntry> {
  const { data } = await apiClient.patch<JournalEntry>(
    `/stagiaires/${payload.stagiaireId}/journal/${payload.entryId}/commentaire`,
    { commentaire: payload.commentaire }
  );
  return data;
}

export function useAddJournalComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addJournalComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["journal", variables.stagiaireId] });
    },
  });
}