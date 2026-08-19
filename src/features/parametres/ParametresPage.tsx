import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ChangePasswordSection } from "@/components/shared/ChangePasswordSection";

const INITIAL_DEPARTEMENTS = [
  "Systèmes d'Information", "Finance", "Ressources Humaines",
  "Marketing", "Data & Analytics", "Opérations",
];

const currentUser = { name: "Rachid Alami", role: "Admin", initials: "RA", email: "rachid.alami@sgas.ma" };

export function ParametresPage() {
  const [departements] = useState(INITIAL_DEPARTEMENTS);

  return (
    <div>
      <PageHeader title="Paramètres" subtitle="Configurez les départements et les préférences de la plateforme." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-1">Départements</h3>
          <p className="text-sm text-slate-500 mb-4">Gérez la liste des départements disponibles dans l'entreprise.</p>
          <div className="space-y-2">
            {departements.map((d) => (
              <div key={d} className="flex items-center justify-between border border-slate-100 rounded-lg px-4 py-3">
                <span className="text-sm text-slate-700">{d}</span>
                <div className="flex items-center gap-3 text-slate-400">
                  <button className="hover:text-blue-600">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button className="hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-blue-600 mt-4 hover:underline">
            <Plus className="h-4 w-4" /> Ajouter un département
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Mon profil</h3>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {currentUser.initials}
            </div>
            <div>
              <p className="font-medium text-slate-900">{currentUser.name}</p>
              <p className="text-sm text-slate-500">{currentUser.role}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Nom complet</label>
              <input defaultValue={currentUser.name} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">E-mail</label>
              <input defaultValue={currentUser.email} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <button className="w-full mt-5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg py-2.5">
            Enregistrer les modifications
          </button>
        </div>
      </div>

      {/* NOUVEAU — seule section réellement branchée au backend de cette
          page pour le moment (le reste au-dessus est encore mocké, voir
          currentUser plus haut) : nécessaire depuis que le premier mot de
          passe de chaque compte est un mot de passe par défaut prévisible
          (voir backend default-password.util.ts). */}
      <div className="mt-4">
        <ChangePasswordSection />
      </div>
    </div>
  );
}
