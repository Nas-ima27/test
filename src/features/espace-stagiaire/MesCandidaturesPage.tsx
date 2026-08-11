// src/features/espace-stagiaire/MesCandidaturesPage.tsx
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useCandidatures } from "@/features/candidatures/api";
import { useStagiaire } from "@/features/stagiaires/api";
import { useAuth } from "@/features/auth/AuthContext";
// TODO: remplacer par l'id du stagiaire réellement connecté une fois l'auth branchée


const STATUT_ICON = {
  "En attente": Clock,
  "Acceptée": CheckCircle2,
  "Refusée": XCircle,
} as const;

export function MesCandidaturesPage() {
  const { user } = useAuth();
const { data: stagiaire } = useStagiaire(user!.id);
  const { data: candidatures = [], isLoading } = useCandidatures();

  const mesCandidatures = candidatures.filter((c) => c.candidatEmail === stagiaire?.email);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mes candidatures</h1>
        <p className="text-slate-500 mt-1 text-sm">Suivez l'état de vos candidatures envoyées.</p>
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-sm text-slate-400">Chargement...</div>
      ) : mesCandidatures.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <p className="text-sm text-slate-500">Vous n'avez pas encore candidaté à un sujet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">
                <th className="px-5 py-3">Sujet</th>
                <th className="px-5 py-3">Date de candidature</th>
                <th className="px-5 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {mesCandidatures.map((c) => {
                const Icon = STATUT_ICON[c.statut];
                return (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                    <td className="px-5 py-3.5 font-medium text-slate-900">{c.sujetTitre}</td>
                    <td className="px-5 py-3.5 text-slate-500">{c.dateCandidature}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5" />
                        <Badge>{c.statut}</Badge>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}