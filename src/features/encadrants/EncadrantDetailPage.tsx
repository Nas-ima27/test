// src/features/encadrants/EncadrantDetailPage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Building2, Pencil, UserPlus } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { StatusToggle } from "@/components/ui/StatusToggle";
import { useEncadrant, useToggleEncadrantActive } from "./api";
import { useStagiaires } from "@/features/stagiaires/api";
import { AffectationModal } from "@/components/shared/AffectationModal";
import { AddEncadrantModal } from "./AddEncadrantModal"; // NOUVEAU — pour le bouton Modifier

export function EncadrantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const encadrantId = Number(id);
  const { data: encadrant, isLoading } = useEncadrant(encadrantId);
  const { data: stagiaires = [] } = useStagiaires();
  const toggleActive = useToggleEncadrantActive();
  const [showAffectation, setShowAffectation] = useState(false);
  const [showEdit, setShowEdit] = useState(false); // NOUVEAU

  if (isLoading) return <div className="p-10 text-center text-sm text-slate-400">Chargement du profil...</div>;
  if (!encadrant) {
    return (
      <div className="p-10 text-center text-sm text-slate-400">
        Encadrant introuvable.{" "}
        <button onClick={() => navigate("/encadrants")} className="text-blue-600 hover:underline">
          Retour à la liste
        </button>
      </div>
    );
  }

  const stagiairesEncadres = stagiaires.filter((s) => s.encadrantId === encadrant.id);

  return (
    <div>
      <button onClick={() => navigate("/encadrants")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft className="h-4 w-4" /> Retour aux encadrants
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={encadrant.name} size="lg" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">{encadrant.name}</h2>
              <p className="text-sm text-slate-500">{encadrant.title}</p>
              <p className="text-sm text-blue-600 font-medium mt-1">{encadrant.departement}</p>
            </div>
          </div>

          {/* MODIFIÉ — ajout du bouton Modifier à côté du toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEdit(true)}
              className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Pencil className="h-4 w-4" /> Modifier
            </button>
            <StatusToggle
              active={encadrant.compteActif}
              onChange={(active) => toggleActive.mutate({ id: encadrant.id, compteActif: active })}
              disabled={toggleActive.isPending}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700">{encadrant.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700">{encadrant.telephone ?? "—"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm sm:col-span-2">
            <Building2 className="h-4 w-4 text-slate-400" />
            <span className="text-slate-700">{encadrant.departement}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-slate-50 rounded-lg py-3 text-center">
            <p className="font-bold text-slate-900">{encadrant.stagiairesActifs}</p>
            <p className="text-xs text-slate-500 mt-0.5">Stagiaires actifs</p>
          </div>
          <div className="bg-slate-50 rounded-lg py-3 text-center">
            <p className="font-bold text-slate-900">{encadrant.totalEncadres}</p>
            <p className="text-xs text-slate-500 mt-0.5">Total encadrés</p>
          </div>
          <div className="bg-slate-50 rounded-lg py-3 text-center">
            <p className="font-bold text-slate-900">{encadrant.sujetsProposes}</p>
            <p className="text-xs text-slate-500 mt-0.5">Sujets proposés</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Stagiaires encadrés</h3>
          <button
            onClick={() => setShowAffectation(true)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
          >
            <UserPlus className="h-4 w-4" /> Affecter un stagiaire
          </button>
        </div>

        {stagiairesEncadres.length === 0 ? (
          <p className="text-sm text-slate-500">Aucun stagiaire affecté pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {stagiairesEncadres.map((s) => (
              <button
                key={s.id}
                onClick={() => navigate(`/stagiaires/${s.id}`)}
                className="w-full flex items-center justify-between border border-slate-100 rounded-lg px-4 py-3 hover:bg-slate-50 text-left"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={s.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.ecole}</p>
                  </div>
                </div>
                <Badge>{s.statut}</Badge>
              </button>
            ))}
          </div>
        )}
      </div>

      {showAffectation && (
        <AffectationModal fixedEncadrantId={encadrant.id} onClose={() => setShowAffectation(false)} />
      )}
      {/* NOUVEAU — modale d'édition, réutilise AddEncadrantModal en mode édition */}
      {showEdit && <AddEncadrantModal encadrant={encadrant} onClose={() => setShowEdit(false)} />}
    </div>
  );
}