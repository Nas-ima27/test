// src/features/stagiaires/journal/api.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { CreateJournalEntryPayload, JournalEntry } from "@/types/journal";
import { mockJournalEntries } from "./mock";

const USE_MOCK = true; // TODO: passer à false une fois le backend NestJS /journal disponible

async function fetchJournalEntries(stagiaireId: number): Promise<JournalEntry[]> {
  if (USE_MOCK) {
    return Promise.resolve(
      mockJournalEntries
        .filter((e) => e.stagiaireId === stagiaireId)
        .sort((a, b) => b.id - a.id) // les plus récentes en premier
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
    mockJournalEntries.push(created); // mutation réelle du tableau — leçon retenue des bugs précédents
    return Promise.resolve(created);
  }
  const { data } = await apiClient.post<JournalEntry>(`/stagiaires/${payload.stagiaireId}/journal`, payload);
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