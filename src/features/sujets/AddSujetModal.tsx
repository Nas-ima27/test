// src/features/sujets/AddSujetModal.tsx
import { FormEvent, useState } from "react";
import { X, Search, AlertCircle } from "lucide-react";
import { CreateSujetPayload, Sujet, SujetStatut } from "@/types/sujet"; // MODIFIÉ — ajout Sujet
import { useCreateSujet, useUpdateSujet, checkSujetSimilarity } from "./api"; // MODIFIÉ — ajout useUpdateSujet

const DEPARTEMENTS = [
  "Systèmes d'Information", "Finance", "Ressources Humaines",
  "Marketing", "Data & Analytics", "Opérations",
];

interface AddSujetModalProps {
  encadrantId: number;
  encadrantName: string;
  departementDefault?: string;
  sujet?: Sujet; // NOUVEAU — présent = mode édition, absent = mode création
  onClose: () => void;
}

interface SimilarSujet {
  id: number;
  titre: string;
  score: number;
}

export function AddSujetModal({ encadrantId, encadrantName, departementDefault, sujet, onClose }: AddSujetModalProps) {
  const isEditing = Boolean(sujet); // NOUVEAU

  const [titre, setTitre] = useState(sujet?.titre ?? "");
  const [description, setDescription] = useState(sujet?.description ?? "");
  const [departement, setDepartement] = useState(sujet?.departement ?? departementDefault ?? DEPARTEMENTS[0]);
  const [technologiesInput, setTechnologiesInput] = useState(sujet?.technologies.join(", ") ?? "");
  const [statut, setStatut] = useState<SujetStatut>(sujet?.statut ?? "Brouillon");

  const [similaires, setSimilaires] = useState<SimilarSujet[] | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  const createSujet = useCreateSujet();
  const updateSujet = useUpdateSujet(); // NOUVEAU

  async function handleCheckSimilarity() {
    if (!titre.trim()) return;
    setChecking(true);
    setCheckError(null);
    try {
      const results = await checkSujetSimilarity(titre, description);
      setSimilaires(results);
    } catch {
      setCheckError("La vérification de similarité nécessite le backend, pas encore disponible en mode démo.");
    } finally {
      setChecking(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const technologies = technologiesInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: CreateSujetPayload = {
      titre,
      description: description || undefined,
      departement,
      encadrantId,
      encadrantName,
      technologies,
      statut,
    };

    if (isEditing && sujet) {
      updateSujet.mutate({ id: sujet.id, payload }, { onSuccess: onClose }); // NOUVEAU
    } else {
      createSujet.mutate(payload, { onSuccess: onClose });
    }
  }

  const isPending = createSujet.isPending || updateSujet.isPending; // NOUVEAU

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-lg shadow-xl my-8">
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            {/* MODIFIÉ — titre dynamique */}
            <h3 className="text-lg font-bold text-slate-900">
              {isEditing ? "Modifier le sujet" : "Proposer un sujet"}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {isEditing ? "Mettez à jour les informations du sujet." : "Décrivez le sujet de stage que vous souhaitez publier."}
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Titre du sujet</label>
            <input
              required
              value={titre}
              onChange={(e) => { setTitre(e.target.value); setSimilaires(null); }}
              placeholder="Ex : Application de gestion des vols et des escales"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setSimilaires(null); }}
              rows={3}
              placeholder="Objectifs, contexte, livrables attendus..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={handleCheckSimilarity}
              disabled={!titre.trim() || checking}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline disabled:opacity-50 disabled:no-underline"
            >
              <Search className="h-3.5 w-3.5" />
              {checking ? "Analyse en cours..." : "Vérifier la similarité avec la bibliothèque"}
            </button>

            {checkError && <p className="text-xs text-slate-400 mt-2">{checkError}</p>}

            {similaires && similaires.length > 0 && (
              <div className="flex items-start gap-2 mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>
                  Proche de « {similaires[0].titre} » ({Math.round(similaires[0].score * 100)}% de similarité) —
                  envisagez de diversifier le sujet.
                </span>
              </div>
            )}

            {similaires && similaires.length === 0 && (
              <p className="text-xs text-emerald-700 mt-2">Aucun sujet similaire détecté.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Département</label>
              <select
                value={departement}
                onChange={(e) => setDepartement(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {DEPARTEMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Statut</label>
              <select
                value={statut}
                onChange={(e) => setStatut(e.target.value as SujetStatut)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="Brouillon">Brouillon</option>
                <option value="Publié">Publié</option>
                <option value="Clos">Clos</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Technologies</label>
            <input
              value={technologiesInput}
              onChange={(e) => setTechnologiesInput(e.target.value)}
              placeholder="React, NestJS, PostgreSQL (séparées par des virgules)"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">
            Annuler
          </button>
          {/* MODIFIÉ — texte dynamique */}
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-60"
          >
            {isPending ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Publier le sujet"}
          </button>
        </div>
      </form>
    </div>
  );
}