// src/features/espace-stagiaire/SujetsDisponiblesPage.tsx
import { useState } from "react";
import { Briefcase, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useSujets } from "@/features/sujets/api";
import { useCandidatures, useCreateCandidature } from "@/features/candidatures/api";
import { useStagiaire } from "@/features/stagiaires/api";
import { useAuth } from "@/features/auth/AuthContext";

export function SujetsDisponiblesPage() {
  const { user } = useAuth();
  const { data: sujets = [], isLoading } = useSujets();
  const { data: candidatures = [] } = useCandidatures();
  const { data: stagiaire } = useStagiaire(user!.id);
  const createCandidature = useCreateCandidature();
  const [candidatingId, setCandidatingId] = useState<number | null>(null);

  const sujetsPublies = sujets.filter((s) => s.statut === "Publié");

  function dejaCandidate(sujetId: number) {
    return candidatures.some(
      (c) => c.sujetId === sujetId && c.candidatEmail === stagiaire?.email
    );
  }

  function handleCandidater(sujetId: number, sujetTitre: string) {
    if (!stagiaire) return;
    setCandidatingId(sujetId);
    createCandidature.mutate(
      {
        candidatName: stagiaire.name,
        candidatEmail: stagiaire.email,
        stagiaireId: stagiaire.id, // NOUVEAU — obligatoire côté backend, toujours l'id du stagiaire connecté
        sujetId,
        sujetTitre,
        ecole: stagiaire.ecole,
      },
      { onSettled: () => setCandidatingId(null) }
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Sujets disponibles</h1>
        <p className="text-slate-500 mt-1 text-sm">Parcourez les sujets publiés et candidatez à ceux qui vous intéressent.</p>
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-sm text-slate-400">Chargement des sujets...</div>
      ) : sujetsPublies.length === 0 ? (
        <div className="p-10 text-center text-sm text-slate-400">Aucun sujet publié pour le moment.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sujetsPublies.map((s) => {
            const dejaFait = dejaCandidate(s.id);
            const isPending = candidatingId === s.id && createCandidature.isPending;

            return (
              <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-slate-900 leading-snug">{s.titre}</h3>
                  <Badge>{s.statut}</Badge>
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

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <span className="text-sm text-slate-500">
                    {s.nombreCandidatures} candidature{s.nombreCandidatures !== 1 ? "s" : ""}
                  </span>

                  {dejaFait ? (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" /> Candidature envoyée
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCandidater(s.id, s.titre)}
                      disabled={isPending}
                      className="flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-3 py-1.5 disabled:opacity-60"
                    >
                      <Briefcase className="h-3.5 w-3.5" />
                      {isPending ? "Envoi..." : "Candidater"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}