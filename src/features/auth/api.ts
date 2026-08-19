// src/features/auth/api.ts
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

/**
 * NOUVEAU : le premier mot de passe de chaque compte est désormais un mot
 * de passe par défaut PRÉVISIBLE (2 lettres nom + 3 lettres prénom + date,
 * voir backend default-password.util.ts — l'envoi par email est
 * désactivé pour le moment). Chaque compte doit donc pouvoir le
 * remplacer — voir ChangePasswordSection.tsx, monté sur les 3 pages
 * "Mon profil" (Admin/Encadrant/Stagiaire).
 */
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await apiClient.patch("/auth/change-password", payload);
}

export function useChangePassword() {
  return useMutation({ mutationFn: changePassword });
}
