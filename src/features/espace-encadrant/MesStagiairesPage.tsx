// src/features/espace-encadrant/MesStagiairesPage.tsx
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useStagiaires } from "@/features/stagiaires/api";
import { useAuth } from "@/features/auth/AuthContext"; // NOUVEAU

export function MesStagiairesPage() {
  const navigate = useNavigate();
  const { user } = useAuth(); // NOUVEAU
  const { data: stagiaires = [], isLoading } = useStagiaires();

  const mesStagiaires = stagiaires.filter((s) => s.encadrantId === user!.id); // CORRIGÉ — était CURRENT_ENCADRANT_ID

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mes stagiaires</h1>
        <p className="text-slate-500 mt-1 text-sm">{mesStagiaires.length} stagiaire{mesStagiaires.length !== 1 ? "s" : ""} sous votre encadrement.</p>
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-sm text-slate-400">Chargement...</div>
      ) : mesStagiaires.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <p className="text-sm text-slate-500">Aucun stagiaire ne vous est encore affecté.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mesStagiaires.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`${s.id}`)}
              className="text-left bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <Avatar name={s.name} />
                <div>
                  <p className="font-semibold text-slate-900">{s.name}</p>
                  <p className="text-sm text-slate-500">{s.ecole}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Badge>{s.statut}</Badge>
                <Badge>{s.rapportStatut}</Badge>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>Avancement</span>
                  <span className="font-medium">{s.avancement}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${s.avancement}%` }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}