// src/features/candidatures/CandidatureDetailModal.tsx
import { X, Mail, Building2, FileText, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Candidature } from "@/types/candidature";
import { useUpdateCandidatureStatus } from "./api";

interface CandidatureDetailModalProps {
  candidature: Candidature;
  onClose: () => void;
}

export function CandidatureDetailModal({ candidature, onClose }: CandidatureDetailModalProps) {
  const updateStatus = useUpdateCandidatureStatus();

  function handleUpdate(statut: "Acceptée" | "Refusée") {
    updateStatus.mutate({ id: candidature.id, statut }, { onSuccess: onClose });
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <Avatar name={candidature.candidatName} />
            <div>
              <h3 className="text-lg font-bold text-slate-900">{candidature.candidatName}</h3>
              <Badge>{candidature.statut}</Badge>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700">{candidature.candidatEmail}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Building2 className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700">{candidature.ecole}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700">Candidature envoyée le {candidature.dateCandidature}</span>
          </div>
          <div className="flex items-start gap-3 text-sm pt-2 border-t border-slate-100 mt-2">
            <FileText className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400">Sujet</p>
              <p className="text-slate-800 font-medium">{candidature.sujetTitre}</p>
            </div>
          </div>

          {candidature.cvUrl ? (
            <a
              href={candidature.cvUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:underline mt-2"
            >
              <FileText className="h-3.5 w-3.5" /> Voir le CV
            </a>
          ) : (
            <p className="text-xs text-slate-400 mt-2">Aucun CV joint.</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          {candidature.statut === "En attente" ? (
            <>
              <button
                onClick={() => handleUpdate("Refusée")}
                disabled={updateStatus.isPending}
                className="px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg disabled:opacity-50"
              >
                Refuser
              </button>
              <button
                onClick={() => handleUpdate("Acceptée")}
                disabled={updateStatus.isPending}
                className="px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50"
              >
                {updateStatus.isPending ? "..." : "Accepter"}
              </button>
            </>
          ) : (
            <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">
              Fermer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}