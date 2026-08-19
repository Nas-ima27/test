// src/features/espace-encadrant/MonProfilPage.tsx
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { useEncadrant, useUpdateEncadrantProfile } from "@/features/encadrants/api";

interface ProfileForm {
  telephone: string;
}

const emptyForm: ProfileForm = { telephone: "" };

export function MonProfilPage() {
  const { user } = useAuth();
  const { data: encadrant, isLoading } = useEncadrant(user!.id);
  const updateProfile = useUpdateEncadrantProfile();
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Pré-remplit le formulaire dès que les données de l'encadrant arrivent.
  useEffect(() => {
    if (encadrant) {
      setForm({ telephone: encadrant.telephone ?? "" });
    }
  }, [encadrant]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    updateProfile.mutate(
      { id: user!.id, payload: form },
      {
        onSuccess: () => setSuccess(true),
        onError: (err: any) => {
          setError(err.response?.data?.message ?? "Une erreur est survenue. Réessayez.");
        },
      }
    );
  }

  if (isLoading) return <div className="p-10 text-center text-sm text-slate-400">Chargement...</div>;
  if (!encadrant) return <div className="p-10 text-center text-sm text-slate-400">Profil introuvable.</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mon profil</h1>
        <p className="text-slate-500 mt-1 text-sm">Consultez et modifiez vos informations personnelles.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl space-y-4">
        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
            {error}
          </div>
        )}
        {success && (
          <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
            Profil mis à jour avec succès.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1.5">Nom complet</label>
            <p className="text-sm text-slate-900 py-2">{encadrant.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1.5">Adresse e-mail</label>
            <p className="text-sm text-slate-900 py-2">{encadrant.email}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Téléphone</label>
          <input
            value={form.telephone}
            onChange={(e) => setForm({ telephone: e.target.value })}
            maxLength={30}
            placeholder="06 12 34 56 78"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="px-4 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg disabled:opacity-60"
          >
            {updateProfile.isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}
