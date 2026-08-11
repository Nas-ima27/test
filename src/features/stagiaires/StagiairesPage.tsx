// src/features/stagiaires/StagiairesPage.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, UserCog, Eye, Pencil, Trash2 } from "lucide-react"; // MODIFIÉ — ajout Eye, Pencil, Trash2
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { AffectationModal } from "../../components/shared/AffectationModal";
import { useStagiaires, useToggleStagiaireActive, useDeleteStagiaire } from "./api"; // MODIFIÉ — ajout useDeleteStagiaire
import { AddStagiaireModal } from "./AddStagiaireModal";
import { Stagiaire } from "@/types/stagiaire"; // NOUVEAU

const DEPARTEMENTS = [
  "Systèmes d'Information", "Finance", "Ressources Humaines",
  "Marketing", "Data & Analytics", "Opérations",
];

export function StagiairesPage() {
  const navigate = useNavigate();
  const { data: stagiaires = [], isLoading } = useStagiaires();
  const toggleActive = useToggleStagiaireActive();
  const deleteStagiaire = useDeleteStagiaire(); // NOUVEAU
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingStagiaire, setEditingStagiaire] = useState<Stagiaire | null>(null); // NOUVEAU
  const [affectationFor, setAffectationFor] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      stagiaires.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.ecole.toLowerCase().includes(query.toLowerCase())
      ),
    [stagiaires, query]
  );

  // NOUVEAU — confirmation avant suppression
  function handleDelete(s: Stagiaire) {
    if (window.confirm(`Supprimer le dossier de ${s.name} ? Cette action est irréversible.`)) {
      deleteStagiaire.mutate(s.id);
    }
  }

  return (
    <div>
      <PageHeader
        title="Stagiaires"
        subtitle={`${filtered.length} stagiaires trouvés`}
        action={<Button icon={Plus} onClick={() => setShowAdd(true)}>Ajouter un stagiaire</Button>}
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un stagiaire, établissement..."
              className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
            <Filter className="h-4 w-4" /> Filtres
          </button>
          <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600">
            <option>Tous les départements</option>
            {DEPARTEMENTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-sm text-slate-400">Chargement des stagiaires...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">
                  <th className="px-5 py-3">Stagiaire</th>
                  <th className="px-5 py-3">Établissement / Formation</th>
                  <th className="px-5 py-3">Département</th>
                  <th className="px-5 py-3">Encadrant</th>
                  <th className="px-5 py-3">Avancement</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3">Compte</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                    <td className="px-5 py-3.5">
                      <button onClick={() => navigate(`/stagiaires/${s.id}`)} className="flex items-center gap-3 text-left">
                        <Avatar name={s.name} />
                        <div>
                          <p className="font-medium text-slate-900 hover:text-blue-600">{s.name}</p>
                          <p className="text-xs text-slate-500">{s.email}</p>
                        </div>
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-slate-800">{s.ecole}</p>
                      <p className="text-xs text-slate-500">{s.filiere}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{s.departement}</td>
                    <td className="px-5 py-3.5">
                      {s.encadrantName ? (
                        <div className="flex items-center gap-2">
                          <Avatar name={s.encadrantName} size="sm" />
                          <span className="text-slate-700">{s.encadrantName}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAffectationFor(s.id)}
                          className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg px-2.5 py-1.5 hover:bg-amber-100"
                        >
                          <UserCog className="h-3.5 w-3.5" /> Affecter
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 w-28">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${s.avancement}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 w-8">{s.avancement}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge>{s.statut}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => toggleActive.mutate({ id: s.id, compteActif: !(s as any).compteActif })}
                        disabled={toggleActive.isPending}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${(s as any).compteActif ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                      >
                        {(s as any).compteActif ? "Actif" : "Inactif"}
                      </button>
                    </td>
                    {/* MODIFIÉ — remplace l'ancien lien "Réaffecter" par les 3 icônes */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-3 text-slate-400">
                        <button
                          title="Voir le profil"
                          onClick={() => navigate(`/stagiaires/${s.id}`)}
                          className="hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          title="Modifier"
                          onClick={() => setEditingStagiaire(s)}
                          className="hover:text-blue-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          title="Supprimer"
                          onClick={() => handleDelete(s)}
                          className="hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && <AddStagiaireModal onClose={() => setShowAdd(false)} />}
      {/* NOUVEAU — modale en mode édition, réutilise le même composant */}
      {editingStagiaire && (
        <AddStagiaireModal stagiaire={editingStagiaire} onClose={() => setEditingStagiaire(null)} />
      )}
      {affectationFor !== null && (
        <AffectationModal fixedStagiaireId={affectationFor} onClose={() => setAffectationFor(null)} />
      )}
    </div>
  );
}