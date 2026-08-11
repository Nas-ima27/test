// src/components/ui/Badge.tsx
import { ReactNode } from "react";

const BADGE_STYLES: Record<string, string> = {
  Actif: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Inactif: "bg-red-50 text-red-700 ring-red-600/10",
  "En cours": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "À venir": "bg-amber-50 text-amber-700 ring-amber-600/20",
  Terminé: "bg-blue-50 text-blue-700 ring-blue-600/20",
  Publié: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Brouillon: "bg-slate-100 text-slate-600 ring-slate-500/20",
  Clos: "bg-slate-100 text-slate-600 ring-slate-500/20",
  "En attente": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "En attente de validation": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Corrections demandées": "bg-orange-50 text-orange-700 ring-orange-600/20",
  Acceptée: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Refusée: "bg-red-50 text-red-700 ring-red-600/10",
  Validé: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Administrateur: "bg-blue-50 text-blue-700 ring-blue-600/20",
  Stagiaire: "bg-slate-100 text-slate-700 ring-slate-500/20",
  Encadrant: "bg-slate-100 text-slate-700 ring-slate-500/20",
  // NOUVEAU — pour le journal de bord
  Journalier: "bg-violet-50 text-violet-700 ring-violet-600/20",
  Hebdomadaire: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
};

interface BadgeProps {
  children: ReactNode;
}

export function Badge({ children }: BadgeProps) {
  const key = String(children);
  const cls = BADGE_STYLES[key] ?? "bg-slate-100 text-slate-700 ring-slate-500/20";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}
    >
      {children}
    </span>
  );
}