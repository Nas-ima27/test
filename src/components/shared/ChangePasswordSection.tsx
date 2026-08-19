// src/components/shared/ChangePasswordSection.tsx
import { FormEvent, useState } from "react";
import { KeyRound } from "lucide-react";
import { useChangePassword } from "@/features/auth/api";
import { useAuth } from "@/features/auth/AuthContext";

const emptyForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

/**
 * NOUVEAU — carte "Changer mon mot de passe", réutilisée sur les 3 pages
 * "Mon profil" (Admin/Encadrant/Stagiaire). Nécessaire depuis que le
 * premier mot de passe de chaque compte est un mot de passe par défaut
 * PRÉVISIBLE (2 lettres nom + 3 lettres prénom + date de début/création
 * — voir backend default-password.util.ts) : chaque compte doit pouvoir
 * le remplacer par un mot de passe de son choix.
 */
export function ChangePasswordSection() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const changePassword = useChangePassword();
  const { updateUser } = useAuth();

  function set(key: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (form.newPassword !== form.confirmPassword) {
      setError("La confirmation ne correspond pas au nouveau mot de passe.");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    changePassword.mutate(
      { currentPassword: form.currentPassword, newPassword: form.newPassword },
      {
        onSuccess: () => {
          setSuccess(true);
          setForm(emptyForm);
          // Lève immédiatement le blocage ProtectedRoute (voir
          // MandatoryPasswordChangeScreen) sans attendre un nouveau login.
          updateUser({ mustChangePassword: false });
        },
        onError: (err: any) => {
          setError(err.response?.data?.message ?? "Une erreur est survenue. Réessayez.");
        },
      }
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl space-y-4"
    >
      <div className="flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-slate-400" />
        <h3 className="font-semibold text-slate-900">Changer mon mot de passe</h3>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
          Mot de passe mis à jour avec succès.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Mot de passe actuel</label>
        <input
          type="password"
          required
          value={form.currentPassword}
          onChange={(e) => set("currentPassword", e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nouveau mot de passe</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.newPassword}
            onChange={(e) => set("newPassword", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.confirmPassword}
            onChange={(e) => set("confirmPassword", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={changePassword.isPending}
          className="px-4 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg disabled:opacity-60"
        >
          {changePassword.isPending ? "Enregistrement..." : "Mettre à jour le mot de passe"}
        </button>
      </div>
    </form>
  );
}
