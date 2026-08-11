// src/components/shared/AffectationModal.tsx
import { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useStagiaires, useAssignEncadrant } from "@/features/stagiaires/api";
import { useEncadrants } from "@/features/encadrants/api";

interface AffectationModalProps {
  fixedStagiaireId?: number;   // si fourni : le stagiaire est déjà connu, on choisit juste l'encadrant
  fixedEncadrantId?: number;   // si fourni : l'encadrant est déjà connu, on choisit juste le stagiaire
  onClose: () => void;
}

export function AffectationModal({ fixedStagiaireId, fixedEncadrantId, onClose }: AffectationModalProps) {
  const { data: stagiaires = [] } = useStagiaires();
  const { data: encadrants = [] } = useEncadrants();
  const assign = useAssignEncadrant();

  const [stagiaireId, setStagiaireId] = useState<number | "">(fixedStagiaireId ?? "");
  const [encadrantId, setEncadrantId] = useState<number | "">(fixedEncadrantId ?? "");

  const stagiaire = stagiaires.find((s) => s.id === stagiaireId);
  const encadrant = encadrants.find((e) => e.id === encadrantId);

  function handleSubmit() {
    if (!stagiaireId || !encadrantId || !encadrant) return;
    assign.mutate(
      { stagiaireId: Number(stagiaireId), encadrantId: Number(encadrantId), encadrantName: encadrant.name },
      { onSuccess: onClose }
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Affectation</h3>
            <p className="text-sm text-slate-500 mt-0.5">Associez un stagiaire à un encadrant.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Stagiaire</label>
            {fixedStagiaireId ? (
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">
                <Avatar name={stagiaire?.name ?? ""} size="sm" />
                <span className="text-sm text-slate-800">{stagiaire?.name}</span>
              </div>
            ) : (
              <select
                value={stagiaireId}
                onChange={(e) => setStagiaireId(e.target.value ? Number(e.target.value) : "")}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="">Sélectionner un stagiaire...</option>
                {stagiaires.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.encadrantName ? `(actuellement: ${s.encadrantName})` : "(non affecté)"}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center justify-center text-slate-300">
            <ArrowRight className="h-5 w-5" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Encadrant</label>
            {fixedEncadrantId ? (
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">
                <Avatar name={encadrant?.name ?? ""} size="sm" />
                <span className="text-sm text-slate-800">{encadrant?.name}</span>
              </div>
            ) : (
              <select
                value={encadrantId}
                onChange={(e) => setEncadrantId(e.target.value ? Number(e.target.value) : "")}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="">Sélectionner un encadrant...</option>
                {encadrants.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} — {e.departement} ({e.stagiairesActifs} actifs)
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!stagiaireId || !encadrantId || assign.isPending}
            className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
          >
            {assign.isPending ? "Affectation..." : "Confirmer l'affectation"}
          </button>
        </div>
      </div>
    </div>
  );
}