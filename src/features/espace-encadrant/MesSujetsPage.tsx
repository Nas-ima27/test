// src/features/espace-encadrant/MesSujetsPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useSujets } from "@/features/sujets/api";
import { useEncadrant } from "@/features/encadrants/api";
import { AddSujetModal } from "@/features/sujets/AddSujetModal";
import { useAuth } from "@/features/auth/AuthContext";
// TODO: remplacer par l'id de l'encadrant réellement connecté une fois l'auth branchée


export function MesSujetsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: encadrant } = useEncadrant(user!.id);
  const { data: sujets = [], isLoading } = useSujets();
  const [showAdd, setShowAdd] = useState(false);

  const mesSujets = sujets.filter((s) => s.encadrantId === encadrant?.id);

  return (
    <div>
      <PageHeader
        title="Mes sujets"
        subtitle={`${mesSujets.length} sujet${mesSujets.length !== 1 ? "s" : ""} proposé${mesSujets.length !== 1 ? "s" : ""}`}
        action={<Button icon={Plus} onClick={() => setShowAdd(true)}>Proposer un sujet</Button>}
      />

      {isLoading ? (
        <div className="p-10 text-center text-sm text-slate-400">Chargement des sujets...</div>
      ) : mesSujets.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <p className="text-sm text-slate-500">Vous n'avez pas encore proposé de sujet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mesSujets.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/espace-encadrant/sujets/${s.id}`)}
              className="text-left bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-slate-900 leading-snug">{s.titre}</h3>
                <Badge>{s.statut}</Badge>
              </div>
              <p className="text-sm text-slate-500 mt-1.5">{s.departement}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {s.technologies.map((t) => (
                  <span key={t} className="text-xs font-medium bg-blue-50 text-blue-700 rounded-full px-2.5 py-1">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-sm text-slate-500">
                  {s.nombreCandidatures} candidature{s.nombreCandidatures !== 1 ? "s" : ""}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {showAdd && encadrant && (
        <AddSujetModal
          encadrantId={encadrant.id}
          encadrantName={encadrant.name}
          departementDefault={encadrant.departement}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}