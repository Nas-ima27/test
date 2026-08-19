// src/features/sujets/SujetsPage.tsx
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { useSujets } from "./api";

export function SujetsPage() {
  const navigate = useNavigate();
  const { data: sujets = [], isLoading } = useSujets();

  return (
    <div>
      <PageHeader
        title="Sujets de stage"
        subtitle="Consultez les sujets proposés par les encadrants."
      />

      {isLoading ? (
        <div className="p-10 text-center text-sm text-slate-400">Chargement des sujets...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sujets.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-slate-900 leading-snug">{s.titre}</h3>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge>{s.statut}</Badge>
                  <Badge>{s.typeCandidat}</Badge>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-1.5">
                {s.departement} · Encadré par {s.encadrantName}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {s.technologies.map((t) => (
                  <span key={t} className="text-xs font-medium bg-blue-50 text-blue-700 rounded-full px-2.5 py-1">
                    {t}
                  </span>
                ))}
              </div>

              {s.sujetsSimilaires && s.sujetsSimilaires.length > 0 && (
                <div className="flex items-start gap-2 mt-3 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>
                    Proche de « {s.sujetsSimilaires[0].titre} » ({Math.round(s.sujetsSimilaires[0].score * 100)}% de
                    similarité) — vérifier la bibliothèque avant publication.
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <span className="text-sm text-slate-500">
                  {s.nombreCandidatures} candidature{s.nombreCandidatures !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => navigate(`/sujets/${s.id}`)}
                  className="text-blue-600 font-medium hover:underline text-sm"
                >
                  Voir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}