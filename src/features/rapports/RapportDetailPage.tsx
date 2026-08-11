// src/features/rapports/RapportDetailPage.tsx
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, Download, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useRapport, useRapports } from "./api";

export function RapportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const rapportId = Number(id);
  const { data: rapport, isLoading } = useRapport(rapportId);
  const { data: rapports = [] } = useRapports();

  if (isLoading) {
    return <div className="p-10 text-center text-sm text-slate-400">Chargement du rapport...</div>;
  }

  if (!rapport) {
    return (
      <div className="p-10 text-center text-sm text-slate-400">
        Rapport introuvable.{" "}
        <button onClick={() => navigate("..")} className="text-blue-600 hover:underline"> {/* CORRIGÉ — était "/bibliotheque" */}
          Retour à la bibliothèque
        </button>
      </div>
    );
  }

  const travauxSimilaires = rapports.filter((r) => r.id !== rapport.id).slice(0, 2);

  return (
    <div>
      <button
        onClick={() => navigate("..")} // CORRIGÉ — était "/bibliotheque"
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à la bibliothèque
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge>Rapport</Badge>
              <Badge>{rapport.statut}</Badge>
              <span className="text-sm text-slate-400">{rapport.annee}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 max-w-2xl">{rapport.titre}</h2>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {rapport.technologies.map((t) => (
                <span key={t} className="text-xs font-medium bg-blue-50 text-blue-700 rounded-full px-2.5 py-1">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Eye className="h-4 w-4" /> Visualiser le PDF
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium">
              <Download className="h-4 w-4" /> Télécharger
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400">Auteur</p>
            <p className="font-medium text-slate-800 mt-0.5">{rapport.auteur}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Encadrant</p>
            <p className="font-medium text-slate-800 mt-0.5">{rapport.encadrant}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Département</p>
            <p className="font-medium text-slate-800 mt-0.5">{rapport.departement}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Validé le</p>
            <p className="font-medium text-slate-800 mt-0.5">{rapport.dateValidation}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-3">Résumé</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{rapport.resume}</p>

          <div className="mt-6 border border-dashed border-slate-200 rounded-xl py-12 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3">
              <Eye className="h-5 w-5" />
            </div>
            <p className="font-medium text-slate-800">Aperçu du document PDF</p>
            <p className="text-sm text-slate-500 mt-1">Cliquez pour visualiser le rapport complet</p>
            <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium mt-4 hover:bg-slate-50">
              <ExternalLink className="h-4 w-4" /> Ouvrir le PDF
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Auteur</p>
            <div className="flex items-center gap-3">
              <Avatar name={rapport.auteur} color="bg-teal-600" />
              <div>
                <p className="font-semibold text-slate-900">{rapport.auteur}</p>
                <p className="text-sm text-slate-500">{rapport.ecole}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Travaux similaires</p>
            <div className="space-y-3">
              {travauxSimilaires.map((r) => (
                <button
                  key={r.id}
                  onClick={() => navigate(`../${r.id}`)} // CORRIGÉ — relatif, était `/bibliotheque/${r.id}`
                  className="block text-left w-full hover:opacity-80"
                >
                  <p className="text-sm font-medium text-slate-800 leading-snug">{r.titre}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {r.auteur} · {r.annee}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}