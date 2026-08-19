// src/features/stagiaires/AddStagiaireModal.tsx
import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import { Stagiaire, RapportStagiaireStatut, TypeStage } from "@/types/stagiaire";
import { useCreateStagiaire, useUpdateStagiaire } from "./api";
import { useEncadrants } from "@/features/encadrants/api";
import { CreatedAccountSummary } from "@/components/shared/CreatedAccountSummary";

interface CreateStagiairePayload {
  name: string;
  email: string;
  ecole: string;
  filiere: string;
  typeStage: TypeStage;
  departement: string;
  encadrantId: number | null;
  dateDebut: string;
  dateFin: string;
  rapportStatut: RapportStagiaireStatut;
}

type ApiStagiairePayload = Omit<CreateStagiairePayload, "encadrantId" | "rapportStatut"> & {
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
  typeStage: "PFA",
  departement: DEPARTEMENTS[0],
  encadrantId: null,
  dateDebut: "",
  dateFin: "",
  rapportStatut: "À venir" as RapportStagiaireStatut,
};

function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function nextDay(date: string): string {
  if (!date) return formatDateForInput(new Date());
  const value = new Date(`${date}T00:00:00`);
  value.setDate(value.getDate() + 1);
  return formatDateForInput(value);
}

function toFormValues(s: Stagiaire): CreateStagiairePayload {
  return {
    name: s.name, email: s.email, ecole: s.ecole, filiere: s.filiere,
    typeStage: s.typeStage,
    departement: s.departement, encadrantId: s.encadrantId, dateDebut: s.dateDebut, dateFin: s.dateFin,
    rapportStatut: s.rapportStatut,
  };
}

function toApiPayload(form: CreateStagiairePayload): ApiStagiairePayload {
  const { rapportStatut, ...rest } = form;
  return {
    ...rest,
    encadrantId: form.encadrantId ?? 0,
  };
}

interface AddStagiaireModalProps {
  stagiaire?: Stagiaire;
  onClose: () => void;
}

export function AddStagiaireModal({ stagiaire, onClose }: AddStagiaireModalProps) {
  const isEditing = Boolean(stagiaire);
  const [form, setForm] = useState<CreateStagiairePayload>(
    stagiaire ? toFormValues(stagiaire) : emptyForm
  );
  const [error, setError] = useState<string | null>(null);
  // NOUVEAU — reste affiché après création (au lieu de fermer directement
  // la modale) pour montrer le mot de passe par défaut du compte de
  // connexion créé en même temps que la fiche (voir CreatedAccountSummary
  // — l'envoi automatique par email est désactivé pour le moment).
  const [createdStagiaire, setCreatedStagiaire] = useState<Stagiaire | null>(null);
  const { data: encadrants = [] } = useEncadrants();
  const createStagiaire = useCreateStagiaire();
  const updateStagiaire = useUpdateStagiaire();
  const today = formatDateForInput(new Date());
  const minimumEndDate = form.dateDebut ? nextDay(form.dateDebut) : today;

  function set<K extends keyof CreateStagiairePayload>(key: K, value: CreateStagiairePayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.dateDebut < today) {
      setError("La date de debut ne peut pas etre dans le passe.");
      return;
    }
    if (form.dateFin <= form.dateDebut) {
      setError("La date de fin doit etre posterieure a la date de debut.");
      return;
    }
    const payload = toApiPayload(form);

    const onError = (err: any) => {
      setError(err.response?.data?.message ?? "Une erreur est survenue. Réessayez.");
    };

    if (isEditing && stagiaire) {
      updateStagiaire.mutate(
        { id: stagiaire.id, payload },
        { onSuccess: onClose, onError }
      );
    } else {
      createStagiaire.mutate(payload, { onSuccess: setCreatedStagiaire, onError });
    }
  }

  const isPending = createStagiaire.isPending || updateStagiaire.isPending;

  if (createdStagiaire && createdStagiaire.tempPassword) {
    return (
      <CreatedAccountSummary
        name={createdStagiaire.name}
        email={createdStagiaire.email}
        tempPassword={createdStagiaire.tempPassword}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-lg shadow-xl my-8">
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
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
          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              {error}
            </div>
          )}

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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Type de stage</label>
            <select
              value={form.typeStage}
              onChange={(e) => set("typeStage", e.target.value as TypeStage)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="PFA">PFA — Projet de Fin d'Année</option>
              <option value="PFE">PFE — Projet de Fin d'Études</option>
            </select>
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
              <input required type="date" value={form.dateDebut} min={today}
                onChange={(e) => {
                  const dateDebut = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    dateDebut,
                    dateFin: prev.dateFin && prev.dateFin <= dateDebut ? "" : prev.dateFin,
                  }));
                }}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date de fin</label>
              <input required type="date" value={form.dateFin} min={minimumEndDate}
                onChange={(e) => set("dateFin", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40" />
            </div>
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