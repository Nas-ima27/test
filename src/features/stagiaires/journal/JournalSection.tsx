// src/features/stagiaires/journal/JournalSection.tsx
import { FormEvent, useState } from "react";
import { NotebookPen, Calendar, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { JournalEntry, JournalType } from "@/types/journal";
import { useJournalEntries, useCreateJournalEntry, useAddJournalComment } from "./api";

interface JournalSectionProps {
  stagiaireId: number;
  readOnly?: boolean; // NOUVEAU — true pour l'encadrant, absent/false pour le stagiaire lui-même
  // NOUVEAU — true pour l'encadrant : peut laisser un commentaire sur
  // chaque entrée, même si readOnly (il ne peut pas écrire de nouvelle
  // entrée, mais peut réagir à celles du stagiaire).
  canComment?: boolean;
}

export function JournalSection({ stagiaireId, readOnly = false, canComment = false }: JournalSectionProps) {
  const { data: entries = [], isLoading } = useJournalEntries(stagiaireId);
  const createEntry = useCreateJournalEntry();

  const [type, setType] = useState<JournalType>("Journalier");
  const [contenu, setContenu] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!contenu.trim()) return;
    createEntry.mutate(
      { stagiaireId, type, contenu: contenu.trim() },
      { onSuccess: () => setContenu("") }
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mt-4">
      <div className="flex items-center gap-2 mb-1">
        <NotebookPen className="h-4 w-4 text-slate-400" />
        <h3 className="font-semibold text-slate-900">Journal de bord</h3>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        {readOnly
          ? "Suivi des tâches réalisées et de l'avancement, consigné par le stagiaire." // MODIFIÉ — texte adapté au contexte encadrant
          : "Consignez vos tâches réalisées et votre avancement, jour par jour ou semaine par semaine."}
      </p>

      {/* MODIFIÉ — formulaire de rédaction masqué en lecture seule */}
      {!readOnly && (
        <form onSubmit={handleSubmit} className="border border-slate-100 rounded-lg p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            {(["Journalier", "Hebdomadaire"] as JournalType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                  type === t ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            rows={3}
            placeholder={
              type === "Journalier"
                ? "Qu'avez-vous fait aujourd'hui ?"
                : "Résumez votre semaine : avancement, tâches réalisées, points bloquants..."
            }
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />

          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={!contenu.trim() || createEntry.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
            >
              {createEntry.isPending ? "Enregistrement..." : "Publier"}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-slate-400 text-center py-4">Chargement...</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">Aucun compte rendu pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <JournalEntryCard
              key={entry.id}
              stagiaireId={stagiaireId}
              entry={entry}
              canComment={canComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface JournalEntryCardProps {
  stagiaireId: number;
  entry: JournalEntry;
  canComment: boolean;
}

/**
 * NOUVEAU — une entrée du journal + son commentaire d'encadrant éventuel.
 * Extrait en sous-composant pour que chaque entrée gère son propre état
 * de formulaire de commentaire, sans interférer avec les autres.
 */
function JournalEntryCard({ stagiaireId, entry, canComment }: JournalEntryCardProps) {
  const addComment = useAddJournalComment();
  const [showForm, setShowForm] = useState(false);
  const [commentaire, setCommentaire] = useState(entry.commentaireEncadrant ?? "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!commentaire.trim()) return;
    addComment.mutate(
      { stagiaireId, entryId: entry.id, commentaire: commentaire.trim() },
      { onSuccess: () => setShowForm(false) }
    );
  }

  return (
    <div className="border border-slate-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge>{entry.type}</Badge>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="h-3 w-3" /> {entry.date}
          </span>
        </div>
      </div>
      <p className="text-sm text-slate-700 whitespace-pre-wrap">{entry.contenu}</p>

      {entry.commentaireEncadrant && !showForm && (
        <div className="flex items-start gap-2 mt-3 text-sm text-blue-700 bg-blue-50 rounded-lg px-3 py-2.5">
          <MessageSquare className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Commentaire de l'encadrant</p>
            <p className="mt-0.5">{entry.commentaireEncadrant}</p>
          </div>
        </div>
      )}

      {canComment && !showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline mt-3"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          {entry.commentaireEncadrant ? "Modifier le commentaire" : "Laisser un commentaire"}
        </button>
      )}

      {canComment && showForm && (
        <form onSubmit={handleSubmit} className="mt-3">
          <textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            rows={2}
            placeholder="Votre retour sur cette entrée..."
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => { setShowForm(false); setCommentaire(entry.commentaireEncadrant ?? ""); }}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!commentaire.trim() || addComment.isPending}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
            >
              {addComment.isPending ? "Envoi..." : "Enregistrer"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
