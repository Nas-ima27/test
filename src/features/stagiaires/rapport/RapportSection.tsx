// src/features/stagiaires/rapport/RapportSection.tsx
import { useRef, useState } from "react";
import { FileUp, FileText, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Stagiaire } from "@/types/stagiaire";
import { useDeposerRapport } from "@/features/stagiaires/api";

interface RapportSectionProps {
  stagiaire: Stagiaire;
}

const STATUT_ICON = {
  "Non déposé": FileText,
  "En attente": Clock,
  "Corrections demandées": AlertTriangle,
  "Validé": CheckCircle2,
} as const;

export function RapportSection({ stagiaire }: RapportSectionProps) {
  const deposerRapport = useDeposerRapport();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const Icon = STATUT_ICON[stagiaire.rapportStatut];

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setSelectedFileName(file.name);
  }

  function handleDeposer() {
    if (!selectedFileName) return;
    deposerRapport.mutate(
      { stagiaireId: stagiaire.id, fichierNom: selectedFileName },
      {
        onSuccess: () => {
          setSelectedFileName(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
      }
    );
  }

  const peutDeposer = stagiaire.rapportStatut !== "Validé";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-4 w-4 text-slate-400" />
        <h3 className="font-semibold text-slate-900">Mon rapport de stage</h3>
      </div>

      {/* État actuel */}
      <div className="flex items-center justify-between border border-slate-100 rounded-lg p-4">
        <div>
          <Badge>{stagiaire.rapportStatut}</Badge>
          {stagiaire.rapportFichierNom && (
            <p className="text-sm text-slate-700 mt-2">
              <FileText className="h-3.5 w-3.5 inline mr-1.5 text-slate-400" />
              {stagiaire.rapportFichierNom}
            </p>
          )}
          {stagiaire.rapportDateDepot && (
            <p className="text-xs text-slate-400 mt-1">Déposé le {stagiaire.rapportDateDepot}</p>
          )}
        </div>
      </div>

      {/* Commentaire de correction, si présent */}
      {stagiaire.rapportStatut === "Corrections demandées" && stagiaire.rapportCommentaire && (
        <div className="flex items-start gap-2 mt-3 text-sm text-orange-700 bg-orange-50 rounded-lg px-4 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Corrections demandées par votre encadrant :</p>
            <p className="mt-1">{stagiaire.rapportCommentaire}</p>
          </div>
        </div>
      )}

      {/* Zone de dépôt */}
      {peutDeposer && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-700 mb-2">
            {stagiaire.rapportStatut === "Non déposé" ? "Déposer mon rapport" : "Redéposer une nouvelle version"}
          </p>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="text-sm text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border file:border-slate-200 file:text-sm file:font-medium file:bg-white file:hover:bg-slate-50"
            />
            <button
              onClick={handleDeposer}
              disabled={!selectedFileName || deposerRapport.isPending}
              className="flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 disabled:opacity-50 shrink-0"
            >
              <FileUp className="h-3.5 w-3.5" />
              {deposerRapport.isPending ? "Envoi..." : "Déposer"}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">Formats acceptés : PDF, DOC, DOCX</p>
        </div>
      )}

      {stagiaire.rapportStatut === "Validé" && (
        <p className="text-sm text-emerald-700 mt-4 pt-4 border-t border-slate-100">
          Votre rapport a été validé — il est maintenant archivé dans la bibliothèque documentaire.
        </p>
      )}
    </div>
  );
}