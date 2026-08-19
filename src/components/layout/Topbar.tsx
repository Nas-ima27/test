// src/components/layout/Topbar.tsx
import { useState } from "react"; // NOUVEAU
import { useNavigate } from "react-router-dom"; // NOUVEAU
import { Search, Bell, ChevronDown, LogOut, User } from "lucide-react"; // MODIFIÉ — ajout LogOut, User
import { useAuth } from "@/features/auth/AuthContext"; // NOUVEAU

// Route "Mon profil" selon l'espace de l'utilisateur connecté — pas de
// page profil pour l'Admin, qui gère ses infos via /utilisateurs.
const PROFIL_ROUTES: Partial<Record<string, string>> = {
  Stagiaire: "/espace-stagiaire/profil",
  Encadrant: "/espace-encadrant/profil",
};

export function Topbar() {
  const { user, logout } = useAuth(); // MODIFIÉ — remplace currentUser en dur
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const profilRoute = user ? PROFIL_ROUTES[user.role] : undefined;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          placeholder="Rechercher un dossier, un utilisateur..."
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
        />
      </div>
      <div className="flex items-center gap-4 ml-6">
        <button className="relative h-9 w-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* MODIFIÉ — menu déroulant fonctionnel, plus un simple bouton décoratif */}
        <div className="relative">
          <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
              {user?.initials ?? "?"}
            </div>
            <span className="text-sm font-medium text-slate-700">{user?.name ?? "Utilisateur"}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {menuOpen && (
            <>
              {/* Zone invisible pour fermer le menu au clic extérieur */}
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.role}</p>
                </div>
                {profilRoute && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(profilRoute);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <User className="h-4 w-4" /> Mon profil
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Déconnexion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}