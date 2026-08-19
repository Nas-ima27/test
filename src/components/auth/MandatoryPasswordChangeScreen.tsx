// src/components/auth/MandatoryPasswordChangeScreen.tsx
import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { ChangePasswordSection } from "@/components/shared/ChangePasswordSection";

/**
 * NOUVEAU — écran plein page qui remplace l'app tant que
 * user.mustChangePassword est vrai (voir ProtectedRoute.tsx). Ce compte
 * utilise encore son mot de passe par défaut PRÉVISIBLE (2 lettres nom +
 * 3 lettres prénom + date — voir backend default-password.util.ts) :
 * tant qu'il n'est pas changé, aucune autre page n'est accessible.
 *
 * Se ferme tout seul dès que ChangePasswordSection réussit : son
 * onSuccess appelle updateUser({ mustChangePassword: false }) (voir
 * AuthContext), ce qui fait retomber ProtectedRoute sur children.
 */
export function MandatoryPasswordChangeScreen() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-start gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <ShieldAlert className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Changement de mot de passe requis</h1>
            <p className="text-sm text-slate-500 mt-1">
              Bonjour {user?.name}. Votre compte utilise encore le mot de
              passe par défaut généré à sa création — vous devez le
              remplacer avant de continuer.
            </p>
          </div>
        </div>

        <ChangePasswordSection />

        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-slate-400 hover:text-slate-600 mt-4"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
