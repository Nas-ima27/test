// src/features/espace-encadrant/MonStagiaireDetailPage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useStagiaire, useEvaluerRapport } from "@/features/stagiaires/api";
import { dureeRestante } from "@/lib/date";
import { JournalSection } from "@/features/stagiaires/journal/JournalSection";
import { TachesSection } from "@/features/stagiaires/taches/TachesSection";

export function MonStagiaireDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: stagiaire, isLoading } = useStagiaire(Number(id));
  const evaluerRapport = useEvaluerRapport();
  const [commentaire, setCommentaire] = useState("");
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);

  if (isLoading) return <div className="p-10 text-center text-sm text-slate-400">Chargement...</div>;
  if (!stagiaire) return <div className="p-10 text-center text-sm text-slate-400">Stagiaire introuvable.</div>;

  function handleValider() {
    evaluerRapport.mutate({ stagiaireId: stagiaire!.id, statut: "Validé" });
  }

  function handleDemanderCorrections() {
    if (!commentaire.trim()) return;
    evaluerRapport.mutate(
      { stagiaireId: stagiaire!.id, statut: "Corrections demandées", commentaire: commentaire.trim() },
      { onSuccess: () => { setCommentaire(""); setShowCorrectionForm(false); } }
    );
  }

  const rapportDeposeEnAttente = stagiaire.rapportStatut === "En attente";

  return (
    <div>
      <button onClick={() => navigate("..")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft className="h-4 w-4" /> Retour à mes stagiaires
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400 mb-1">E-mail</p>
            <p className="flex items-center gap-1.5 text-sm text-slate-800"><Mail className="h-3.5 w-3.5 text-slate-400" /> {stagiaire.email}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Téléphone</p>
            <p className="flex items-center gap-1.5 text-sm text-slate-800"><Phone className="h-3.5 w-3.5 text-slate-400" /> {stagiaire.telephone ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Département</p>
            <p className="flex items-center gap-1.5 text-sm text-slate-800"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {stagiaire.departement}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Durée restante</p>
            <p className="text-sm font-medium text-slate-800">{dureeRestante(stagiaire.dateFin)}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-slate-700">{stagiaire.avancement}% complété</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${stagiaire.avancement}%` }} />
          </div>
        </div>
      </div>

      {/* NOUVEAU — bloc de validation du rapport */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-slate-400" />
          <h3 className="font-semibold text-slate-900">Rapport de stage</h3>
        </div>

        <div className="flex items-center justify-between border border-slate-100 rounded-lg p-4">
          <div>
            <Badge>{stagiaire.rapportStatut}</Badge>
            {stagiaire.rapportFichierNom && (
              <p className="text-sm text-slate-700 mt-2">
                <FileText className="h-3.5 w-3.5 inline mr-1.5 text-slate-400" />
                {/* CORRECTIF — le nom du fichier n'était pas cliquable :
                    l'encadrant n'avait aucun moyen de consulter le rapport
                    déposé (même pattern que RapportSection.tsx côté stagiaire). */}
                {stagiaire.rapportFichierUrl ? (
                  <a
                    href={stagiaire.rapportFichierUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-600"
                  >
                    {stagiaire.rapportFichierNom}
                  </a>
                ) : (
                  stagiaire.rapportFichierNom
                )}
              </p>
            )}
            {stagiaire.rapportDateDepot && (
              <p className="text-xs text-slate-400 mt-1">Déposé le {stagiaire.rapportDateDepot}</p>
            )}
          </div>
        </div>

        {rapportDeposeEnAttente && !showCorrectionForm && (
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleValider}
              disabled={evaluerRapport.isPending}
              className="flex items-center gap-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg px-4 py-2 disabled:opacity-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Valider le rapport
            </button>
            <button
              onClick={() => setShowCorrectionForm(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg px-4 py-2"
            >
              <AlertTriangle className="h-3.5 w-3.5" /> Demander des corrections
            </button>
          </div>
        )}

        {rapportDeposeEnAttente && showCorrectionForm && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Précisez les corrections attendues
            </label>
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              rows={3}
              placeholder="Ex : Ajouter une section méthodologie, revoir la partie sur les résultats..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => { setShowCorrectionForm(false); setCommentaire(""); }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleDemanderCorrections}
                disabled={!commentaire.trim() || evaluerRapport.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg disabled:opacity-50"
              >
                {evaluerRapport.isPending ? "Envoi..." : "Envoyer la demande"}
              </button>
            </div>
          </div>
        )}

        {stagiaire.rapportStatut === "Corrections demandées" && stagiaire.rapportCommentaire && (
          <div className="flex items-start gap-2 mt-3 text-sm text-orange-700 bg-orange-50 rounded-lg px-4 py-3">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Votre commentaire : {stagiaire.rapportCommentaire}</span>
          </div>
        )}

        {stagiaire.rapportStatut === "Non déposé" && (
          <p className="text-sm text-slate-500 mt-4">Le stagiaire n'a pas encore déposé son rapport.</p>
        )}

        {stagiaire.rapportStatut === "Validé" && (
          <p className="text-sm text-emerald-700 mt-4">Rapport validé — archivé dans la bibliothèque documentaire.</p>
        )}
      </div>

      {/* NOUVEAU — l'encadrant peut assigner des tâches à ce stagiaire */}
      <TachesSection stagiaireId={stagiaire.id} canCreate />

      {/* Journal de bord en lecture seule, mais commentable par l'encadrant */}
       <JournalSection stagiaireId={stagiaire.id} readOnly canComment />
    </div>
  );
}