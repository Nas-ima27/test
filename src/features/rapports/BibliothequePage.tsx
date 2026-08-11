// src/features/rapports/BibliothequePage.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { useRapports } from "./api";

const DEPARTEMENTS = ["Tous les départements", "Systèmes d'Information", "Finance", "Ressources Humaines", "Marketing", "Data & Analytics", "Opérations"]; // MODIFIÉ — "Tous les départements" intégré à la liste
const ANNEES = ["Toutes les années", "2024", "2023"]; // MODIFIÉ — idem

export function BibliothequePage() {
  const { data: rapports = [], isLoading } = useRapports();
  const [query, setQuery] = useState("");
  const [departementFilter, setDepartementFilter] = useState(DEPARTEMENTS[0]); // NOUVEAU
  const [anneeFilter, setAnneeFilter] = useState(ANNEES[0]); // NOUVEAU
  const navigate = useNavigate();

  const filtered = useMemo(
    () =>
      rapports.filter((r) => {
        const matchesQuery = r.titre.toLowerCase().includes(query.toLowerCase());
        const matchesDept = departementFilter === DEPARTEMENTS[0] || r.departement === departementFilter;
        const matchesAnnee = anneeFilter === ANNEES[0] || String(r.annee) === anneeFilter;
        return matchesQuery && matchesDept && matchesAnnee;
      }),
    [rapports, query, departementFilter, anneeFilter] // MODIFIÉ — nouvelles dépendances
  );

  return (
    <div>
      <PageHeader title="Bibliothèque documentaire" subtitle="Consultez les rapports et projets archivés des anciens stagiaires." />

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par titre, mot-clé..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
        {/* MODIFIÉ — value + onChange ajoutés */}
        <select
          value={departementFilter}
          onChange={(e) => setDepartementFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-600"
        >
          {DEPARTEMENTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        {/* MODIFIÉ — value + onChange ajoutés */}
        <select
          value={anneeFilter}
          onChange={(e) => setAnneeFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-600"
        >
          {ANNEES.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-sm text-slate-400">Chargement de la bibliothèque...</div>
      ) : filtered.length === 0 ? (
        // NOUVEAU — message si le filtre ne donne rien
        <div className="p-10 text-center text-sm text-slate-400">Aucun rapport ne correspond à ces critères.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => navigate(`${r.id}`)}
              className="text-left bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge>{r.statut}</Badge>
                <span className="text-xs text-slate-400">{r.annee}</span>
              </div>
              <h3 className="font-semibold text-slate-900 leading-snug">{r.titre}</h3>
              <p className="text-sm text-slate-500 mt-1">
                {r.auteur} · {r.departement}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {r.technologies.slice(0, 3).map((t) => (
                  <span key={t} className="text-xs font-medium bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">
                    {t}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}