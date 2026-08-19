// src/components/shared/CreatedAccountSummary.tsx
import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CreatedAccountSummaryProps {
  name: string;
  email: string;
  tempPassword: string;
  onClose: () => void;
}

/**
 * NOUVEAU — écran affiché après création d'un compte (Utilisateur admin/RH,
 * Encadrant, Stagiaire) montrant son mot de passe par défaut. Réutilisé par
 * AddUserModal / AddEncadrantModal / AddStagiaireModal.
 *
 * L'envoi automatique par email (Resend) est désactivé pour le moment
 * (décision prise en conversation — domaine sandbox onboarding@resend.dev
 * peu fiable) : ce mot de passe, généré selon une formule prévisible
 * (2 lettres nom + 3 lettres prénom + date, voir backend
 * default-password.util.ts), doit être communiqué manuellement par
 * l'admin. Il n'est affiché qu'ici, une seule fois — seul son hash est
 * conservé côté serveur.
 */
export function CreatedAccountSummary({ name, email, tempPassword, onClose }: CreatedAccountSummaryProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(tempPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl p-6">
        <h3 className="text-lg font-bold text-slate-900">Compte créé</h3>
        <p className="text-sm text-slate-500 mt-0.5">
          {name} ({email})
        </p>

        <p className="text-sm text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5 mt-4">
          L'envoi automatique par e-mail est désactivé pour le moment.
          Communiquez ce mot de passe vous-même — il ne sera plus jamais
          affiché (le compte pourra le changer depuis "Mon profil").
        </p>

        <div className="mt-3">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Mot de passe par défaut
          </label>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-mono bg-slate-100 border border-slate-200 rounded-lg px-3 py-2.5 select-all">
              {tempPassword}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg px-3 py-2.5 hover:bg-slate-50 shrink-0"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copié" : "Copier"}
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
