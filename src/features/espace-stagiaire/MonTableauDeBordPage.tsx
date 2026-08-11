// src/features/espace-stagiaire/MonTableauDeBordPage.tsx
import { Mail, Phone, MapPin, FileText, UserCog } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useStagiaire } from "@/features/stagiaires/api";
import { dureeRestante, dureeTotaleJours } from "@/lib/date";
import { useAuth } from "@/features/auth/AuthContext";

export function MonTableauDeBordPage() {
  const { user } = useAuth();
  const { data: stagiaire, isLoading } = useStagiaire(user!.id);

  if (isLoading) return <div className="p-10 text-center text-sm text-slate-400">Chargement...</div>;
  if (!stagiaire) return <div className="p-10 text-center text-sm text-slate-400">Profil introuvable.</div>;

  const totalJours = dureeTotaleJours(stagiaire.dateDebut, stagiaire.dateFin);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Bonjour, {stagiaire.name.split(" ")[0]} 👋</h1>
        <p className="text-slate-500 mt-1 text-sm">Voici un aperçu de votre stage.</p>
      </div>

      {/* Carte principale — identité + progression */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={stagiaire.name} size="lg" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">{stagiaire.name}</h2>
              <p className="text-sm text-slate-500">{stagiaire.filiere} · {stagiaire.ecole}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge>{stagiaire.statut}</Badge>
                <Badge>{stagiaire.rapportStatut}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400 mb-1">E-mail</p>
            <p className="flex items-center gap-1.5 text-sm text-slate-800">
              <Mail className="h-3.5 w-3.5 text-slate-400" /> {stagiaire.email}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Téléphone</p>
            <p className="flex items-center gap-1.5 text-sm text-slate-800">
              <Phone className="h-3.5 w-3.5 text-slate-400" /> {stagiaire.telephone ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Département</p>
            <p className="flex items-center gap-1.5 text-sm text-slate-800">
              <MapPin className="h-3.5 w-3.5 text-slate-400" /> {stagiaire.departement}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Durée restante</p>
            <p className="text-sm font-medium text-slate-800">{dureeRestante(stagiaire.dateFin)}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-500">{stagiaire.dateDebut}</span>
            <span className="font-medium text-slate-700">{stagiaire.avancement}% complété</span>
            <span className="text-slate-500">{stagiaire.dateFin}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${stagiaire.avancement}%` }} />
          </div>
          {totalJours !== null && <p className="text-xs text-slate-400 mt-2">{totalJours} jours au total</p>}
        </div>
      </div>

      {/* Cartes secondaires — encadrant + rapport */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <UserCog className="h-4 w-4 text-slate-400" />
            <p className="text-xs font-semibold text-slate-400 uppercase">Mon encadrant</p>
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
            <FileText className="h-4 w-4 text-slate-400" />
            <p className="text-xs font-semibold text-slate-400 uppercase">Mon rapport</p>
          </div>
          <div className="flex items-center justify-between">
            <Badge>{stagiaire.rapportStatut}</Badge>
            {stagiaire.rapportStatut === "Non déposé" && (
              <span className="text-xs text-slate-500">Rendez-vous dans "Mon rapport" pour le déposer</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}