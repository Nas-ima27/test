import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { CreateUserPayload, User } from "@/types/user";
import { mockUsers } from "./mock";

const USE_MOCK = false; // backend NestJS /users branché

async function fetchUsers(): Promise<User[]> {
  if (USE_MOCK) return Promise.resolve(mockUsers);
  const { data } = await apiClient.get<User[]>("/users");
  return data;
}

async function createUser(payload: CreateUserPayload): Promise<User> {
  if (USE_MOCK) {
    return Promise.resolve({ id: Date.now(), createdAt: new Date().toLocaleDateString("fr-FR"), status: "Actif", ...payload });
  }
  const { data } = await apiClient.post<User>("/users", payload);
  return data;
}

// SUPPRIMÉ — deleteUser / useDeleteUser retirés : le backend n'implémente
// pas DELETE /users/:id (décision prise en conversation, voir
// BACKEND_SPEC_UPDATED.md §2 et §12 "dette technique assumée"). Le bouton
// de suppression correspondant doit aussi être retiré côté UsersPage.tsx.

export function useUsers() {
  return useQuery({ queryKey: ["users"], queryFn: fetchUsers });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}