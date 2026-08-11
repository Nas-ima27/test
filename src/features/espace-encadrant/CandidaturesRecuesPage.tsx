// src/features/espace-encadrant/CandidaturesRecuesPage.tsx
import { useState } from "react"; // NOUVEAU
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useCandidatures, useUpdateCandidatureStatus } from "@/features/candidatures/api";
import { useSujets } from "@/features/sujets/api";
import { CandidatureDetailModal } from "@/features/candidatures/CandidatureDetailModal"; // NOUVEAU
import { Candidature } from "@/types/candidature"; // NOUVEAU

const CURRENT_ENCADRANT_ID = 1;

export function CandidaturesRecuesPage() {
  const { data: candidatures = [], isLoading } = useCandidatures();
  const { data: sujets = [] } = useSujets();
  const updateStatus = useUpdateCandidatureStatus();
  const [selected, setSelected] = useState<Candidature | null>(null); // NOUVEAU

  const mesSujetsIds = sujets.filter((s) => s.encadrantId === CURRENT_ENCADRANT_ID).map((s) => s.id);
  const candidaturesRecues = candidatures.filter((c) => mesSujetsIds.includes(c.sujetId));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Candidatures reçues</h1>
        <p className="text-slate-500 mt-1 text-sm">Étudiez les candidatures reçues sur vos sujets de stage.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-sm text-slate-400">Chargement...</div>
        ) : candidaturesRecues.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">Aucune candidature reçue pour le moment.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">
                <th className="px-5 py-3">Candidat</th>
                <th className="px-5 py-3">Sujet</th>
                <th className="px-5 py-3">Établissement</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {candidaturesRecues.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.candidatName} />
                      <span className="font-medium text-slate-900">{c.candidatName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">{c.sujetTitre}</td>
                  <td className="px-5 py-3.5 text-slate-600">{c.ecole}</td>
                  <td className="px-5 py-3.5 text-slate-500">{c.dateCandidature}</td>
                  <td className="px-5 py-3.5">
                    <Badge>{c.statut}</Badge>
                  </td>
                  {/* MODIFIÉ — l'œil est toujours visible et cliquable, plus conditionné au statut */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      {c.statut === "En attente" && (
                        <>
                          <button
                            onClick={() => updateStatus.mutate({ id: c.id, statut: "Acceptée" })}
                            disabled={updateStatus.isPending}
                            className="text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg px-2.5 py-1.5 hover:bg-emerald-100 disabled:opacity-50"
                          >
                            Accepter
                          </button>
                          <button
                            onClick={() => updateStatus.mutate({ id: c.id, statut: "Refusée" })}
                            disabled={updateStatus.isPending}
                            className="text-xs font-medium text-red-700 bg-red-50 rounded-lg px-2.5 py-1.5 hover:bg-red-100 disabled:opacity-50"
                          >
                            Refuser
                          </button>
                        </>
                      )}
                      <button onClick={() => setSelected(c)} className="text-slate-400 hover:text-blue-600">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && <CandidatureDetailModal candidature={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}