// src/features/espace-encadrant/MonTableauDeBordPage.tsx
import { GraduationCap, ClipboardList, Briefcase, FileText } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useEncadrant } from "@/features/encadrants/api";
import { useStagiaires } from "@/features/stagiaires/api";
import { useSujets } from "@/features/sujets/api";
import { useCandidatures } from "@/features/candidatures/api";
import { useAuth } from "@/features/auth/AuthContext";

export function MonTableauDeBordPage() {
  const { user } = useAuth(); // CORRIGÉ — déplacé à l'intérieur du composant
  const { data: encadrant, isLoading: loadingEncadrant } = useEncadrant(user!.id); // CORRIGÉ — était CURRENT_ENCADRANT_ID
  const { data: stagiaires = [] } = useStagiaires();
  const { data: sujets = [] } = useSujets();
  const { data: candidatures = [] } = useCandidatures();

  if (loadingEncadrant) return <div className="p-10 text-center text-sm text-slate-400">Chargement...</div>;
  if (!encadrant) return <div className="p-10 text-center text-sm text-slate-400">Profil introuvable.</div>;

  const mesStagiaires = stagiaires.filter((s) => s.encadrantId === encadrant.id);
  const mesSujets = sujets.filter((s) => s.encadrantId === encadrant.id);
  const mesSujetsIds = mesSujets.map((s) => s.id);
  const candidaturesRecues = candidatures.filter((c) => mesSujetsIds.includes(c.sujetId));
  const candidaturesEnAttente = candidaturesRecues.filter((c) => c.statut === "En attente");
  const rapportsEnAttente = mesStagiaires.filter((s) => s.rapportStatut === "En attente");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Bonjour, {encadrant.name.split(" ").slice(-1)[0]} 👋</h1>
        <p className="text-slate-500 mt-1 text-sm">Voici un aperçu de votre activité d'encadrement.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Stagiaires actifs" value={mesStagiaires.length} icon={GraduationCap} tint="bg-blue-50 text-blue-600" />
        <StatCard label="Sujets proposés" value={mesSujets.length} icon={ClipboardList} tint="bg-violet-50 text-violet-600" />
        <StatCard label="Candidatures en attente" value={candidaturesEnAttente.length} icon={Briefcase} tint="bg-amber-50 text-amber-600" />
        <StatCard label="Rapports à valider" value={rapportsEnAttente.length} icon={FileText} tint="bg-emerald-50 text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Mes stagiaires</h3>
          {mesStagiaires.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun stagiaire affecté pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {mesStagiaires.map((s) => (
                <div key={s.id} className="flex items-center justify-between border border-slate-100 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.avancement}% complété</p>
                    </div>
                  </div>
                  <Badge>{s.statut}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Candidatures récentes</h3>
          {candidaturesRecues.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune candidature reçue pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {candidaturesRecues.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between border border-slate-100 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{c.candidatName}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[220px]">{c.sujetTitre}</p>
                  </div>
                  <Badge>{c.statut}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}