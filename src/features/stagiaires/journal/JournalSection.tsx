// src/features/stagiaires/journal/JournalSection.tsx
import { FormEvent, useState } from "react";
import { NotebookPen, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { JournalType } from "@/types/journal";
import { useJournalEntries, useCreateJournalEntry } from "./api";

interface JournalSectionProps {
  stagiaireId: number;
  readOnly?: boolean; // NOUVEAU — true pour l'encadrant, absent/false pour le stagiaire lui-même
}

export function JournalSection({ stagiaireId, readOnly = false }: JournalSectionProps) {
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
            <div key={entry.id} className="border border-slate-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge>{entry.type}</Badge>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="h-3 w-3" /> {entry.date}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{entry.contenu}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}