// src/features/auth/LoginPage.tsx
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useAuth } from "./AuthContext";
import { AppRole } from "@/types/auth";

const ROLE_HOME: Record<AppRole, string> = {
  Admin: "/",
  Encadrant: "/espace-encadrant",
  Stagiaire: "/espace-stagiaire",
};

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login({ email, password });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Une erreur est survenue.");
      return;
    }

    // La redirection par rôle se fait après connexion réussie — le hook a mis à jour `user`
    const role = JSON.parse(sessionStorage.getItem("sgas_user") ?? "{}").role as AppRole | undefined;
    navigate(role ? ROLE_HOME[role] : "/");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">S</div>
          <span className="text-slate-900 font-semibold text-xl tracking-tight">SGAS</span>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6">
          <h1 className="text-lg font-bold text-slate-900 mb-1">Connexion</h1>
          <p className="text-sm text-slate-500 mb-6">Accédez à votre espace SGAS.</p>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2.5 mb-4">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse e-mail</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@sgas.ma"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mot de passe</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg py-2.5 disabled:opacity-60"
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Repères de test en mode démo — à retirer une fois le backend réel branché */}
        <div className="mt-4 text-xs text-slate-400 text-center leading-relaxed">
          Comptes de test : yasmine.bennani@sgas.ma / admin123 · karima.alaoui@sgas.ma / encadrant123 · sara.elamrani@emi.ac.ma / stagiaire123
        </div>
      </div>
    </div>
  );
}