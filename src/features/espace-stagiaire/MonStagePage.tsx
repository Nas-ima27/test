// src/features/espace-stagiaire/MonStagePage.tsx
import { Calendar, MapPin, UserCog, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useStagiaire } from "@/features/stagiaires/api";
import { useSujets } from "@/features/sujets/api";
import { dureeRestante, dureeTotaleJours } from "@/lib/date";
import { JournalSection } from "@/features/stagiaires/journal/JournalSection"; // NOUVEAU
import { useAuth } from "@/features/auth/AuthContext";


export function MonStagePage() {
  const { user } = useAuth();
  const { data: stagiaire, isLoading } = useStagiaire(user!.id);
  const { data: sujets = [] } = useSujets();

  if (isLoading) return <div className="p-10 text-center text-sm text-slate-400">Chargement...</div>;
  if (!stagiaire) return <div className="p-10 text-center text-sm text-slate-400">Profil introuvable.</div>;

  const sujetAssigne = sujets.find((s) => s.id === stagiaire.sujetId);
  const totalJours = dureeTotaleJours(stagiaire.dateDebut, stagiaire.dateFin);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mon stage</h1>
        <p className="text-slate-500 mt-1 text-sm">Détails et progression de votre stage en cours.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Badge>{stagiaire.statut}</Badge>
            <span className="text-sm text-slate-400">{dureeRestante(stagiaire.dateFin)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700">{stagiaire.dateDebut} → {stagiaire.dateFin}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700">{stagiaire.departement}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <ClipboardList className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700">{stagiaire.ecole} · {stagiaire.filiere}</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-slate-700">{stagiaire.avancement}% complété</span>
            {totalJours !== null && <span className="text-slate-400 text-xs">{totalJours} jours au total</span>}
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${stagiaire.avancement}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <UserCog className="h-4 w-4 text-slate-400" />
            <p className="text-xs font-semibold text-slate-400 uppercase">Encadrant</p>
          </div>
          {stagiaire.encadrantName ? (
            <div className="flex items-center gap-3">
              <Avatar name={stagiaire.encadrantName} />
              <div>
                <p className="font-medium text-slate-900 text-sm">{stagiaire.encadrantName}</p>
                <p className="text-xs text-slate-500">{stagiaire.departement}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Aucun encadrant affecté pour le moment.</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="h-4 w-4 text-slate-400" />
            <p className="text-xs font-semibold text-slate-400 uppercase">Sujet assigné</p>
          </div>
          {sujetAssigne ? (
            <div>
              <p className="font-medium text-slate-900 text-sm">{sujetAssigne.titre}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {sujetAssigne.technologies.map((t) => (
                  <span key={t} className="text-xs font-medium bg-blue-50 text-blue-700 rounded-full px-2 py-0.5">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Aucun sujet assigné pour le moment.</p>
          )}
        </div>
      </div>

      {/* NOUVEAU — journal de bord en bas de page */}
      <JournalSection stagiaireId={stagiaire.id} />
    </div>
  );
}