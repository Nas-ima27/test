import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import { CreateUserPayload, UserRole, UserStatus } from "@/types/user";
import { useCreateUser } from "./api";

interface AddUserModalProps {
  onClose: () => void;
}

const initialForm: CreateUserPayload = {
  firstName: "",
  lastName: "",
  email: "",
  service: "",
  role: "Stagiaire",
  status: "Actif",
};

export function AddUserModal({ onClose }: AddUserModalProps) {
  const [form, setForm] = useState<CreateUserPayload>(initialForm);
  const createUser = useCreateUser();

  function handleChange<K extends keyof CreateUserPayload>(key: K, value: CreateUserPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createUser.mutate(form, { onSuccess: onClose });
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Nouvel utilisateur</h3>
            <p className="text-sm text-slate-500 mt-0.5">Créez un nouveau compte pour accéder à SGAS.</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Prénom</label>
              <input
                required
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom</label>
              <input
                required
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse e-mail</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Service</label>
            <input
              required
              placeholder="Ex : Ressources humaines"
              value={form.service}
              onChange={(e) => handleChange("service", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Rôle</label>
              <select
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value as UserRole)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              >
                <option>Stagiaire</option>
                <option>Encadrant</option>
                <option>RH</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Statut</label>
              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value as UserStatus)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              >
                <option>Actif</option>
                <option>Inactif</option>
                <option>Suspendu</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">
            Annuler
          </button>
          <button
            type="submit"
            disabled={createUser.isPending}
            className="px-4 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg disabled:opacity-60"
          >
            {createUser.isPending ? "Création..." : "Créer le compte"}
          </button>
        </div>
      </form>
    </div>
  );
}
