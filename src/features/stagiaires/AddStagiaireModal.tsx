// src/features/stagiaires/AddStagiaireModal.tsx
import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import { Stagiaire, RapportStagiaireStatut } from "@/types/stagiaire";
import { useCreateStagiaire, useUpdateStagiaire } from "./api";
import { useEncadrants } from "@/features/encadrants/api";

interface CreateStagiairePayload {
  name: string;
  email: string;
  ecole: string;
  filiere: string;
  departement: string;
  encadrantId: number | null;
  dateDebut: string;
  dateFin: string;
  rapportStatut: RapportStagiaireStatut;
}

type ApiStagiairePayload = Omit<CreateStagiairePayload, "encadrantId"> & {
  encadrantId: number;
};

const DEPARTEMENTS = [
  "Systèmes d'Information", "Finance", "Ressources Humaines",
  "Marketing", "Data & Analytics", "Opérations",
];

const emptyForm: CreateStagiairePayload = {
  name: "",
  email: "",
  ecole: "",
  filiere: "",
  departement: DEPARTEMENTS[0],
  encadrantId: null,
  dateDebut: "",
  dateFin: "",
  rapportStatut: "À venir" as RapportStagiaireStatut,
};

// NOUVEAU — convertit un Stagiaire existant en valeurs de formulaire, pour le mode édition
function toFormValues(s: Stagiaire): CreateStagiairePayload {
  return {
    name: s.name, email: s.email, ecole: s.ecole, filiere: s.filiere,
    departement: s.departement, encadrantId: s.encadrantId, dateDebut: s.dateDebut, dateFin: s.dateFin,
    rapportStatut: s.rapportStatut,
  };
}

function toApiPayload(form: CreateStagiairePayload): ApiStagiairePayload {
  return {
    ...form,
    encadrantId: form.encadrantId ?? 0,
  };
}

interface AddStagiaireModalProps {
  stagiaire?: Stagiaire; // NOUVEAU — présent = mode édition, absent = mode création
  onClose: () => void;
}

export function AddStagiaireModal({ stagiaire, onClose }: AddStagiaireModalProps) {
  const isEditing = Boolean(stagiaire); // NOUVEAU
  const [form, setForm] = useState<CreateStagiairePayload>(
    stagiaire ? toFormValues(stagiaire) : emptyForm
  );
  const { data: encadrants = [] } = useEncadrants();
  const createStagiaire = useCreateStagiaire();
  const updateStagiaire = useUpdateStagiaire(); // NOUVEAU

  function set<K extends keyof CreateStagiairePayload>(key: K, value: CreateStagiairePayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = toApiPayload(form);

    if (isEditing && stagiaire) {
      updateStagiaire.mutate(
        { id: stagiaire.id, payload },
        { onSuccess: onClose }
      );
    } else {
      createStagiaire.mutate(payload, { onSuccess: onClose });
    }
  }

  const isPending = createStagiaire.isPending || updateStagiaire.isPending; // NOUVEAU

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-lg shadow-xl my-8">
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            {/* MODIFIÉ — titre dynamique */}
            <h3 className="text-lg font-bold text-slate-900">
              {isEditing ? "Modifier le stagiaire" : "Ajouter un stagiaire"}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {isEditing ? "Mettez à jour les informations du dossier." : "Créez le compte et le dossier du stagiaire."}
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom complet</label>
            <input required value={form.name} onChange={(e) => set("name", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse e-mail</label>
            <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Établissement</label>
              <input required value={form.ecole} onChange={(e) => set("ecole", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Filière</label>
              <input required value={form.filiere} onChange={(e) => set("filiere", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Département</label>
              <select value={form.departement} onChange={(e) => set("departement", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                {DEPARTEMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Encadrant (optionnel)</label>
              <select
                value={form.encadrantId ?? ""}
                onChange={(e) => set("encadrantId", e.target.value ? Number(e.target.value) : null)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="">À affecter plus tard</option>
                {encadrants.map((enc) => (
                  <option key={enc.id} value={enc.id}>{enc.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date de début</label>
              <input required type="date" onChange={(e) => set("dateDebut", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date de fin</label>
              <input required type="date" onChange={(e) => set("dateFin", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">
            Annuler
          </button>
          {/* MODIFIÉ — texte du bouton dynamique */}
          <button type="submit" disabled={isPending}
            className="px-4 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg disabled:opacity-60">
            {isPending ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Créer le compte"}
          </button>
        </div>
      </form>
    </div>
  );
}