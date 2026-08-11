// src/components/layout/StagiaireSidebar.tsx
import { NavLink, useNavigate } from "react-router-dom"; // MODIFIÉ — ajout useNavigate
import {
  LayoutDashboard, ClipboardList, Briefcase, GraduationCap, FileUp, BookOpen, LogOut,
} from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext"; // NOUVEAU
const NAV_ITEMS = [
  { to: "/espace-stagiaire", label: "Mon tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/espace-stagiaire/sujets", label: "Sujets disponibles", icon: ClipboardList },
  { to: "/espace-stagiaire/candidatures", label: "Mes candidatures", icon: Briefcase },
  { to: "/espace-stagiaire/mon-stage", label: "Mon stage", icon: GraduationCap },
  { to: "/espace-stagiaire/rapport", label: "Mon rapport", icon: FileUp },
  { to: "/espace-stagiaire/bibliotheque", label: "Bibliothèque", icon: BookOpen },
];

export function StagiaireSidebar() {
  const { user, logout } = useAuth(); // MODIFIÉ — remplace currentStagiaire en dur
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="w-64 shrink-0 bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-white/5">
        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          S
        </div>
        <span className="text-white font-semibold text-lg tracking-tight">SGAS</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
            {user?.initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">Stagiaire</p>
          </div>
        </div>
        {/* MODIFIÉ — bouton fonctionnel */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-2 py-2 mt-1 rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}