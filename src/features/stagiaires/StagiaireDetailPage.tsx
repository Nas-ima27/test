// src/features/stagiaires/StagiaireDetailPage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, CheckCircle2, Mail, Phone, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useStagiaire } from "./api";
import { dureeRestante, dureeTotaleJours } from "@/lib/date";
import { InformationsTab } from "./tabs/InformationsTab"; // NOUVEAU

type TabId = "informations" | "stage" | "documents" | "historique";

const TABS: { id: TabId; label: string }[] = [
  { id: "informations", label: "Informations" },
  { id: "stage", label: "Stage" },
  { id: "documents", label: "Documents" },
  { id: "historique", label: "Historique" },
];

export function StagiaireDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: stagiaire, isLoading } = useStagiaire(Number(id));
  const [activeTab, setActiveTab] = useState<TabId>("informations");

  if (isLoading) return <div className="p-10 text-center text-sm text-slate-400">Chargement du profil...</div>;

  if (!stagiaire) {
    return (
      <div className="p-10 text-center text-sm text-slate-400">
        Stagiaire introuvable.{" "}
        <button onClick={() => navigate("/stagiaires")} className="text-blue-600 hover:underline">
          Retour à la liste
        </button>
      </div>
    );
  }

  const totalJours = dureeTotaleJours(stagiaire.dateDebut, stagiaire.dateFin);

  return (
    <div>
      <button onClick={() => navigate("/stagiaires")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft className="h-4 w-4" /> Retour aux stagiaires
      </button>

      {/* HEADER — inchangé */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={stagiaire.name} size="lg" />
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{stagiaire.name}</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {stagiaire.filiere} · {stagiaire.ecole}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge>{stagiaire.statut}</Badge>
                <Badge>{stagiaire.rapportStatut}</Badge>
                <Badge>{stagiaire.typeStage}</Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Pencil className="h-4 w-4" /> Modifier
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" /> Valider le rapport
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400 mb-1">E-mail</p>
            <a href={`mailto:${stagiaire.email}`} className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
              <Mail className="h-3.5 w-3.5" /> {stagiaire.email}
            </a>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Téléphone</p>
            <p className="flex items-center gap-1.5 text-sm text-slate-800">
              <Phone className="h-3.5 w-3.5 text-slate-400" /> {stagiaire.telephone ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Département</p>
            <p className="flex items-center gap-1.5 text-sm text-slate-800">
              <MapPin className="h-3.5 w-3.5 text-slate-400" /> {stagiaire.departement}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Durée restante</p>
            <p className="text-sm font-medium text-slate-800">{dureeRestante(stagiaire.dateFin)}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-500">{stagiaire.dateDebut}</span>
            <span className="font-medium text-slate-700">{stagiaire.avancement}% complété</span>
            <span className="text-slate-500">{stagiaire.dateFin}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${stagiaire.avancement}%` }} />
          </div>
          {totalJours !== null && (
            <p className="text-xs text-slate-400 mt-2">{totalJours} jours au total</p>
          )}
        </div>
      </div>

      {/* ONGLETS */}
      <div className="bg-white rounded-xl border border-slate-200 mt-4">
        <div className="flex items-center gap-6 px-6 border-b border-slate-100">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* MODIFIÉ — l'onglet Informations utilise maintenant le vrai composant */}
          {activeTab === "informations" && <InformationsTab stagiaire={stagiaire} />}
          {activeTab === "stage" && <p className="text-sm text-slate-400">Onglet Stage — à venir</p>}
          {activeTab === "documents" && <p className="text-sm text-slate-400">Onglet Documents — à venir</p>}
          {activeTab === "historique" && <p className="text-sm text-slate-400">Onglet Historique — à venir</p>}
        </div>
      </div>
    </div>
  );
}
