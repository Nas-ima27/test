// src/features/encadrants/EncadrantsPage.tsx
import { useState } from "react"; // NOUVEAU
import { useNavigate } from "react-router-dom"; // NOUVEAU
import { Plus, Eye, Pencil, UserPlus } from "lucide-react"; // MODIFIÉ — Users remplacé par UserPlus (plus parlant pour "Affecter")
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { StatusToggle } from "@/components/ui/StatusToggle"; // NOUVEAU
import { AffectationModal } from "@/components/shared/AffectationModal"; // NOUVEAU
import { useEncadrants, useToggleEncadrantActive } from "./api"; // MODIFIÉ — ajout useToggleEncadrantActive
import { AddEncadrantModal } from "./AddEncadrantModal"; // NOUVEAU

export function EncadrantsPage() {
  const navigate = useNavigate(); // NOUVEAU
  const { data: encadrants = [], isLoading } = useEncadrants();
  const toggleActive = useToggleEncadrantActive(); // NOUVEAU
  const [showAdd, setShowAdd] = useState(false); // NOUVEAU — modale "Ajouter"
  const [editingEncadrant, setEditingEncadrant] = useState<typeof encadrants[number] | null>(null); // NOUVEAU — modale "Modifier"
  const [affectationFor, setAffectationFor] = useState<number | null>(null); // NOUVEAU — modale "Affecter"

  return (
    <div>
      <PageHeader
        title="Encadrants"
        subtitle={`${encadrants.length} encadrants actifs`}
        // MODIFIÉ — le bouton "Ajouter un encadrant" ouvre maintenant la modale
        action={<Button icon={Plus} onClick={() => setShowAdd(true)}>Ajouter un encadrant</Button>}
      />

      {isLoading ? (
        <div className="p-10 text-center text-sm text-slate-400">Chargement des encadrants...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {encadrants.map((e) => (
            <div key={e.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Avatar name={e.name} />
                  <div>
                    <p className="font-semibold text-slate-900">{e.name}</p>
                    <p className="text-sm text-slate-500">{e.title}</p>
                    <p className="text-sm text-blue-600 font-medium">{e.departement}</p>
                  </div>
                </div>
              </div>

              {/* NOUVEAU — toggle actif/inactif directement sur la carte */}
              <div className="mt-3">
                <StatusToggle
                  active={e.compteActif}
                  onChange={(active) => toggleActive.mutate({ id: e.id, compteActif: active })}
                  disabled={toggleActive.isPending}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-slate-50 rounded-lg py-3 text-center">
                  <p className="font-bold text-slate-900">{e.stagiairesActifs}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Stagiaires actifs</p>
                </div>
                <div className="bg-slate-50 rounded-lg py-3 text-center">
                  <p className="font-bold text-slate-900">{e.totalEncadres}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Total encadrés</p>
                </div>
                <div className="bg-slate-50 rounded-lg py-3 text-center">
                  <p className="font-bold text-slate-900">{e.sujetsProposes}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Sujets proposés</p>
                </div>
              </div>

              {/* MODIFIÉ — les 3 boutons ont maintenant un onClick */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-sm">
                <button
                  onClick={() => navigate(`/encadrants/${e.id}`)}
                  className="flex items-center gap-1.5 text-blue-600 font-medium hover:underline"
                >
                  <Eye className="h-4 w-4" /> Voir
                </button>
                <button
                  onClick={() => setEditingEncadrant(e)}
                  className="flex items-center gap-1.5 text-slate-600 font-medium hover:underline"
                >
                  <Pencil className="h-4 w-4" /> Modifier
                </button>
                <button
                  onClick={() => setAffectationFor(e.id)}
                  className="flex items-center gap-1.5 text-slate-600 font-medium hover:underline"
                >
                  <UserPlus className="h-4 w-4" /> Affecter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NOUVEAU — les 3 modales pilotées par les états ci-dessus */}
      {showAdd && <AddEncadrantModal onClose={() => setShowAdd(false)} />}
      {editingEncadrant && (
        <AddEncadrantModal encadrant={editingEncadrant} onClose={() => setEditingEncadrant(null)} />
      )}
      {affectationFor !== null && (
        <AffectationModal fixedEncadrantId={affectationFor} onClose={() => setAffectationFor(null)} />
      )}
    </div>
  );
}