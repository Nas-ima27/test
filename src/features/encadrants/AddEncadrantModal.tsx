// src/features/encadrants/AddEncadrantModal.tsx
import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import { CreateEncadrantPayload, Encadrant } from "@/types/encadrant";
import { useCreateEncadrant, useUpdateEncadrant } from "./api";

const DEPARTEMENTS = [
  "Systèmes d'Information", "Finance", "Ressources Humaines",
  "Marketing", "Data & Analytics", "Opérations",
];

const emptyForm: CreateEncadrantPayload = { name: "", title: "", email: "", departement: DEPARTEMENTS[0] };

function toFormValues(e: Encadrant): CreateEncadrantPayload {
  return { name: e.name, title: e.title, email: e.email, departement: e.departement };
}

interface AddEncadrantModalProps {
  encadrant?: Encadrant;
  onClose: () => void;
}

export function AddEncadrantModal({ encadrant, onClose }: AddEncadrantModalProps) {
  const isEditing = Boolean(encadrant);
  const [form, setForm] = useState<CreateEncadrantPayload>(encadrant ? toFormValues(encadrant) : emptyForm);
  const [error, setError] = useState<string | null>(null);
  const createEncadrant = useCreateEncadrant();
  const updateEncadrant = useUpdateEncadrant();

  function set<K extends keyof CreateEncadrantPayload>(key: K, value: CreateEncadrantPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const onError = (err: any) => {
      setError(err.response?.data?.message ?? "Une erreur est survenue. Réessayez.");
    };

    if (isEditing && encadrant) {
      updateEncadrant.mutate({ id: encadrant.id, payload: form }, { onSuccess: onClose, onError });
    } else {
      createEncadrant.mutate(form, { onSuccess: onClose, onError });
    }
  }

  const isPending = createEncadrant.isPending || updateEncadrant.isPending;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEditing ? "Modifier l'encadrant" : "Ajouter un encadrant"}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {isEditing ? "Mettez à jour les informations du profil." : "Créez un compte encadrant pour un département."}
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom complet</label>
            <input required placeholder="Ex : M. Karim Idrissi" value={form.name} onChange={(e) => set("name", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Fonction</label>
            <input required placeholder="Ex : Ingénieur Sénior" value={form.title} onChange={(e) => set("title", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse e-mail</label>
            <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Département</label>
            <select value={form.departement} onChange={(e) => set("departement", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40">
              {DEPARTEMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">
            Annuler
          </button>
          <button type="submit" disabled={isPending}
            className="px-4 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg disabled:opacity-60">
            {isPending ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Créer le compte"}
          </button>
        </div>
      </form>
    </div>
  );
}