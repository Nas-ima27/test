// src/features/stagiaires/taches/TachesSection.tsx
import { FormEvent, useState } from "react";
import { ListChecks, Plus, CheckCircle2, Circle } from "lucide-react";
import { useTaches, useCreateTache, useUpdateTacheStatut } from "./api";

interface TachesSectionProps {
  stagiaireId: number;
  // NOUVEAU — true côté encadrant : peut assigner de nouvelles tâches.
  canCreate?: boolean;
  // NOUVEAU — true côté stagiaire : peut cocher/décocher ses tâches.
  canToggle?: boolean;
}

/**
 * NOUVEAU — "tâches à faire" que l'encadrant assigne à son stagiaire.
 * Montée en mode canCreate sur MonStagiaireDetailPage.tsx (encadrant) et
 * en mode canToggle sur MonStagePage.tsx (stagiaire).
 */
export function TachesSection({ stagiaireId, canCreate = false, canToggle = false }: TachesSectionProps) {
  const { data: taches = [], isLoading } = useTaches(stagiaireId);
  const createTache = useCreateTache();
  const updateStatut = useUpdateTacheStatut();

  const [showForm, setShowForm] = useState(false);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!titre.trim()) return;
    createTache.mutate(
      { stagiaireId, titre: titre.trim(), description: description.trim() || undefined },
      {
        onSuccess: () => {
          setTitre("");
          setDescription("");
          setShowForm(false);
        },
      }
    );
  }

  function toggleStatut(tacheId: number, statutActuel: string) {
    updateStatut.mutate({
      stagiaireId,
      tacheId,
      statut: statutActuel === "Faite" ? "À faire" : "Faite",
    });
  }

  const enCours = taches.filter((t) => t.statut === "À faire");
  const terminees = taches.filter((t) => t.statut === "Faite");

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mt-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-slate-400" />
          <h3 className="font-semibold text-slate-900">Tâches à faire</h3>
        </div>
        {canCreate && !showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline"
          >
            <Plus className="h-3.5 w-3.5" /> Assigner une tâche
          </button>
        )}
      </div>
      <p className="text-sm text-slate-500 mb-4">
        {canCreate
          ? "Assignez des tâches à votre stagiaire et suivez leur avancement."
          : "Tâches assignées par votre encadrant."}
      </p>

      {canCreate && showForm && (
        <form onSubmit={handleSubmit} className="border border-slate-100 rounded-lg p-4 mb-5">
          <input
            required
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Titre de la tâche"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Détails (optionnel)"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 mt-2"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={() => { setShowForm(false); setTitre(""); setDescription(""); }}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!titre.trim() || createTache.isPending}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
            >
              {createTache.isPending ? "Envoi..." : "Assigner"}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-slate-400 text-center py-4">Chargement...</p>
      ) : taches.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">Aucune tâche pour le moment.</p>
      ) : (
        <div className="space-y-2">
          {[...enCours, ...terminees].map((tache) => (
            <div
              key={tache.id}
              className={`flex items-start gap-3 border border-slate-100 rounded-lg p-3 ${
                tache.statut === "Faite" ? "opacity-60" : ""
              }`}
            >
              <button
                type="button"
                disabled={!canToggle || updateStatut.isPending}
                onClick={() => toggleStatut(tache.id, tache.statut)}
                className={`shrink-0 mt-0.5 ${canToggle ? "cursor-pointer" : "cursor-default"}`}
                aria-label={tache.statut === "Faite" ? "Marquer comme à faire" : "Marquer comme faite"}
              >
                {tache.statut === "Faite" ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                ) : (
                  <Circle className="h-4.5 w-4.5 text-slate-300" />
                )}
              </button>
              <div className="min-w-0">
                <p className={`text-sm font-medium text-slate-800 ${tache.statut === "Faite" ? "line-through" : ""}`}>
                  {tache.titre}
                </p>
                {tache.description && (
                  <p className="text-xs text-slate-500 mt-0.5 whitespace-pre-wrap">{tache.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
