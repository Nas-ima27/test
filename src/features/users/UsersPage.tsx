// src/features/users/UsersPage.tsx
import { useMemo, useState } from "react"; // MODIFIÉ — ajout useMemo
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { useUsers, useDeleteUser } from "./api";
import { AddUserModal } from "./AddUserModal";

const ROLES = ["Tous les rôles", "RH", "Encadrant", "Stagiaire"]; // CORRIGÉ — alignés sur types/user.ts
const STATUTS = ["Tous les statuts", "Actif", "Inactif"]; // CORRIGÉ — "Suspendu" retiré, n'existe pas dans UserStatus

export function UsersPage() {
  const [showModal, setShowModal] = useState(false);
  const { data: users = [], isLoading } = useUsers();
  const deleteUser = useDeleteUser();

  // NOUVEAU — état des filtres, absent avant
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState(ROLES[0]);
  const [statutFilter, setStatutFilter] = useState(STATUTS[0]);

  // NOUVEAU — la liste réellement affichée, recalculée à chaque changement de filtre
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      const matchesQuery =
        query.trim() === "" ||
        fullName.includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase());
      const matchesRole = roleFilter === ROLES[0] || u.role === roleFilter;
      const matchesStatut =
        statutFilter === STATUTS[0] || u.status === statutFilter;
      return matchesQuery && matchesRole && matchesStatut;
    });
  }, [users, query, roleFilter, statutFilter]);

  return (
    <div>
      <PageHeader
        title="Utilisateurs"
        subtitle="Gérez les comptes et les accès de vos équipes."
        action={
          <Button icon={Plus} onClick={() => setShowModal(true)}>
            Nouvel utilisateur
          </Button>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            {/* MODIFIÉ — value + onChange ajoutés */}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          {/* MODIFIÉ — value + onChange ajoutés */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600"
          >
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          {/* MODIFIÉ — value + onChange ajoutés */}
          <select
            value={statutFilter}
            onChange={(e) => setStatutFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600"
          >
            {STATUTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-sm text-slate-400">
            Chargement des utilisateurs...
          </div>
        ) : filtered.length === 0 ? (
          // NOUVEAU — message si aucun résultat, sinon le tableau paraît "cassé" en silence
          <div className="p-10 text-center text-sm text-slate-400">
            Aucun utilisateur ne correspond à ces critères.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">
                <th className="px-5 py-3">Utilisateur</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Rôle</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3">Créé le</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {/* MODIFIÉ — filtered au lieu de users */}
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-slate-50 hover:bg-slate-50/60"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={`${u.firstName} ${u.lastName}`} />
                      <div>
                        <p className="font-medium text-slate-900">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{u.service}</td>
                  <td className="px-5 py-3.5">
                    <Badge>{u.role}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge>{u.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{u.createdAt}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-3 text-slate-400">
                      <button className="hover:text-blue-600">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        className="hover:text-red-600"
                        onClick={() => deleteUser.mutate(u.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex items-center justify-between px-5 py-3.5 text-sm text-slate-500">
          {/* MODIFIÉ — reflète filtered.length, pas users.length */}
          <span>
            Affichage de 1 à {filtered.length} sur {users.length}
          </span>
          <div className="flex items-center gap-2">
            <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-slate-700 font-medium">Page 1 / 1</span>
            <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {showModal && <AddUserModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
