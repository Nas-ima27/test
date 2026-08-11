import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { CreateUserPayload, User } from "@/types/user";
import { mockUsers } from "./mock";

const USE_MOCK = true; // TODO: passer à false une fois le backend NestJS /users disponible

async function fetchUsers(): Promise<User[]> {
  if (USE_MOCK) return Promise.resolve(mockUsers);
  const { data } = await apiClient.get<User[]>("/users");
  return data;
}

async function createUser(payload: CreateUserPayload): Promise<User> {
  if (USE_MOCK) {
    return Promise.resolve({ id: Date.now(), createdAt: new Date().toLocaleDateString("fr-FR"), ...payload });
  }
  const { data } = await apiClient.post<User>("/users", payload);
  return data;
}

async function deleteUser(id: number): Promise<void> {
  if (USE_MOCK) return Promise.resolve();
  await apiClient.delete(`/users/${id}`);
}

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

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}
