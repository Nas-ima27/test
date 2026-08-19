// MODIFIÉ — UserRole supprimé (le champ n'existe plus côté backend,
// voir FRONTEND_INTEGRATION_NOTES.md §4).
export type UserStatus = "Actif" | "Inactif"; // MODIFIÉ — "Suspendu" retiré, n'existe pas dans UtilisateurStatus côté backend

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  service: string;
  status: UserStatus;
  createdAt: string;
  // Présent UNIQUEMENT dans la réponse de POST /users (jamais sur
  // GET /users) — mot de passe par défaut du compte, à communiquer
  // manuellement (envoi automatique par email désactivé pour le moment,
  // voir UsersService.create côté backend).
  tempPassword?: string;
}

// MODIFIÉ — role retiré ; isSuperAdmin ajouté (optionnel, décide si le
// nouveau compte peut lui-même créer d'autres comptes internes — voir
// BACKEND_SPEC_UPDATED.md §11)
export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  service: string;
  isSuperAdmin?: boolean;
}