import { GraduationCap, ClipboardList, Briefcase, BookOpen, CheckCircle2, Clock } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { useDashboardStats } from "./api";

const RECENT_ACTIVITY = [
  { icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50", text: "Rapport de Mehdi Fassi validé par Mme. Salma Tahiri", time: "il y a 2 heures" },
  { icon: Briefcase, color: "text-amber-600 bg-amber-50", text: "Nouvelle candidature reçue pour « Application de gestion des vols »", time: "il y a 5 heures" },
  { icon: Clock, color: "text-blue-600 bg-blue-50", text: "Sujet « Portail interne de gestion des congés » enregistré en brouillon", time: "hier" },
];

export function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading || !stats) {
    return <div className="p-10 text-center text-sm text-slate-400">Chargement du tableau de bord...</div>;
  }

  return (
    <div>
      <PageHeader title="Tableau de bord" subtitle="Vue d'ensemble de l'activité des stages." />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Stagiaires actifs" value={stats.stagiairesActifs} icon={GraduationCap} trend="+3 ce mois" tint="bg-blue-50 text-blue-600" />
        <StatCard label="Sujets disponibles" value={stats.sujetsDisponibles} icon={ClipboardList} tint="bg-violet-50 text-violet-600" />
        <StatCard label="Candidatures en attente" value={stats.candidaturesEnAttente} icon={Briefcase} tint="bg-amber-50 text-amber-600" />
        <StatCard label="Rapports archivés" value={stats.rapportsArchives} icon={BookOpen} trend="+1 ce mois" tint="bg-emerald-50 text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-1">Évolution des stages</h3>
          <p className="text-sm text-slate-500 mb-4">Nombre de stages démarrés par mois</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={stats.evolutionMensuelle}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="stages" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: "#2563eb" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-1">Par département</h3>
          <p className="text-sm text-slate-500 mb-4">Stagiaires actifs</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.parDepartement} layout="vertical" margin={{ left: 8 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="dept" type="category" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 mt-4">
        <h3 className="font-semibold text-slate-900 mb-4">Activité récente</h3>
        <div className="space-y-4">
          {RECENT_ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${a.color}`}>
                <a.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-slate-700">{a.text}</p>
                <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
