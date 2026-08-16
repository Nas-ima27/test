import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import { CreateUserPayload } from "@/types/user";
import { useCreateUser } from "./api";

interface AddUserModalProps {
  onClose: () => void;
}

const initialForm: CreateUserPayload = {
  firstName: "",
  lastName: "",
  email: "",
  service: "",
  isSuperAdmin: false,
};

export function AddUserModal({ onClose }: AddUserModalProps) {
  const [form, setForm] = useState<CreateUserPayload>(initialForm);
  // NOUVEAU — affiche le message d'erreur si la création échoue (ex: 409
  // "Un compte existe déjà avec cet email.") — avant, l'échec était silencieux.
  const [error, setError] = useState<string | null>(null);
  const createUser = useCreateUser();

  function handleChange<K extends keyof CreateUserPayload>(key: K, value: CreateUserPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    createUser.mutate(form, {
      onSuccess: onClose,
      onError: (err: any) => {
        setError(err.response?.data?.message ?? "Une erreur est survenue. Réessayez.");
      },
    });
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Nouvel utilisateur</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Créez un nouveau compte interne. Les identifiants de connexion
              seront envoyés par e-mail automatiquement.
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Prénom</label>
              <input
                required
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom</label>
              <input
                required
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse e-mail</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Service</label>
            <input
              required
              placeholder="Ex : Ressources humaines"
              value={form.service}
              onChange={(e) => handleChange("service", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            />
          </div>

          {/* NOUVEAU — remplace les anciens champs Rôle/Statut, retirés
              (n'existent plus côté backend, voir
              FRONTEND_INTEGRATION_NOTES.md §4). isSuperAdmin détermine si
              ce nouveau compte pourra lui-même créer d'autres comptes
              internes ("Admin complet") ou seulement gérer
              Encadrant/Stagiaire ("Gestionnaire", valeur par défaut). */}
          <label className="flex items-start gap-2.5 border border-slate-200 rounded-lg px-3 py-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isSuperAdmin ?? false}
              onChange={(e) => handleChange("isSuperAdmin", e.target.checked)}
              className="mt-0.5"
            />
            <span className="text-sm text-slate-700">
              <span className="font-medium">Administrateur principal</span>
              <br />
              <span className="text-slate-500">
                Pourra créer d'autres comptes internes. Laissez décoché pour
                un compte "Gestionnaire" (accès complet sauf création de
                comptes).
              </span>
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">
            Annuler
          </button>
          <button
            type="submit"
            disabled={createUser.isPending}
            className="px-4 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg disabled:opacity-60"
          >
            {createUser.isPending ? "Création..." : "Créer le compte"}
          </button>
        </div>
      </form>
    </div>
  );
}