// src/features/espace-encadrant/MonSujetDetailPage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertCircle, Building2, Briefcase, Pencil, EyeOff, Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useSujet, useUpdateSujetStatut } from "@/features/sujets/api";
import { AddSujetModal } from "@/features/sujets/AddSujetModal";
import { useAuth } from "@/features/auth/AuthContext";

export function MonSujetDetailPage() {
  const { user } = useAuth(); // à l'intérieur du composant, pas au niveau du fichier
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: sujet, isLoading } = useSujet(Number(id));
  const updateStatut = useUpdateSujetStatut();
  const [showEdit, setShowEdit] = useState(false);

  if (isLoading) return <div className="p-10 text-center text-sm text-slate-400">Chargement du sujet...</div>;

  if (!sujet) {
    return (
      <div className="p-10 text-center text-sm text-slate-400">
        Sujet introuvable.{" "}
        <button onClick={() => navigate("..")} className="text-blue-600 hover:underline">
          Retour à mes sujets
        </button>
      </div>
    );
  }

  const estPublie = sujet.statut === "Publié";

  function handleToggleStatut() {
    updateStatut.mutate({ id: sujet!.id, statut: estPublie ? "Brouillon" : "Publié" });
  }

  return (
    <div>
      <button onClick={() => navigate("..")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft className="h-4 w-4" /> Retour à mes sujets
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge>{sujet.statut}</Badge>
            </div>
            <h2 className="text-xl font-bold text-slate-900 max-w-2xl">{sujet.titre}</h2>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {sujet.technologies.map((t) => (
                <span key={t} className="text-xs font-medium bg-blue-50 text-blue-700 rounded-full px-2.5 py-1">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowEdit(true)}
              className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Pencil className="h-4 w-4" /> Modifier
            </button>
            {sujet.statut !== "Clos" && (
              <button
                onClick={handleToggleStatut}
                disabled={updateStatut.isPending}
                className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {estPublie ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {estPublie ? "Dépublier" : "Publier"}
              </button>
            )}
          </div>
        </div>

        {sujet.sujetsSimilaires && sujet.sujetsSimilaires.length > 0 && (
          <div className="flex items-start gap-2 mt-4 text-sm text-amber-700 bg-amber-50 rounded-lg px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              Proche de « {sujet.sujetsSimilaires[0].titre} » ({Math.round(sujet.sujetsSimilaires[0].score * 100)}%
              de similarité) — vérifier la bibliothèque.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 text-sm">
            <Building2 className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700">{sujet.departement}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Briefcase className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700">
              {sujet.nombreCandidatures} candidature{sujet.nombreCandidatures !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {sujet.description && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mt-4">
          <h3 className="font-semibold text-slate-900 mb-3">Description</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{sujet.description}</p>
        </div>
      )}

      {showEdit && (
        <AddSujetModal
          sujet={sujet}
          encadrantId={user!.id}
          encadrantName={sujet.encadrantName}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}