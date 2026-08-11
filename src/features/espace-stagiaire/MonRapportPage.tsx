// src/features/espace-stagiaire/MonRapportPage.tsx
import { useStagiaire } from "@/features/stagiaires/api";
import { RapportSection } from "@/features/stagiaires/rapport/RapportSection";
import { useAuth } from "@/features/auth/AuthContext";
// TODO: remplacer par l'id du stagiaire réellement connecté une fois l'auth branchée


export function MonRapportPage() {
  const { user } = useAuth();
const { data: stagiaire, isLoading } = useStagiaire(user!.id);

  if (isLoading) return <div className="p-10 text-center text-sm text-slate-400">Chargement...</div>;
  if (!stagiaire) return <div className="p-10 text-center text-sm text-slate-400">Profil introuvable.</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mon rapport</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Déposez votre rapport de stage et suivez son statut de validation par votre encadrant.
        </p>
      </div>

      <RapportSection stagiaire={stagiaire} />
    </div>
  );
}