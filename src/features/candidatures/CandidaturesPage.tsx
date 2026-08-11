import { Eye } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useCandidatures, useUpdateCandidatureStatus } from "./api";

export function CandidaturesPage() {
  const { data: candidatures = [], isLoading } = useCandidatures();
  const updateStatus = useUpdateCandidatureStatus();

  return (
    <div>
      <PageHeader title="Candidatures" subtitle="Suivez et traitez les candidatures reçues sur vos sujets de stage." />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-sm text-slate-400">Chargement des candidatures...</div>
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
              {candidatures.map((c) => (
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
                  <td className="px-5 py-3.5">
                    {c.statut === "En attente" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => updateStatus.mutate({ id: c.id, statut: "Acceptée" })}
                          className="text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg px-2.5 py-1.5 hover:bg-emerald-100"
                        >
                          Accepter
                        </button>
                        <button
                          onClick={() => updateStatus.mutate({ id: c.id, statut: "Refusée" })}
                          className="text-xs font-medium text-red-700 bg-red-50 rounded-lg px-2.5 py-1.5 hover:bg-red-100"
                        >
                          Refuser
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <button className="text-slate-400 hover:text-blue-600">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
