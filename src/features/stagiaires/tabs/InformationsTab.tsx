// src/features/stagiaires/tabs/InformationsTab.tsx
import { Linkedin, Github } from "lucide-react";
import { Stagiaire } from "@/types/stagiaire";

interface InformationsTabProps {
  stagiaire: Stagiaire;
}

type FieldProps = {
  label: string;
  value: React.ReactNode;
};

function Field({ label, value }: FieldProps) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <div className="text-sm font-medium text-slate-900">{value}</div>
    </div>
  );
}

export function InformationsTab({ stagiaire }: InformationsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
      <div className="space-y-5">
        <h4 className="font-semibold text-slate-900">Informations personnelles</h4>

        <Field label="Nom complet" value={stagiaire.name} />
        <Field label="E-mail" value={stagiaire.email} />
        <Field label="Téléphone" value={stagiaire.telephone ?? "—"} />

        <Field
          label="LinkedIn"
          value={
            stagiaire.linkedin ? (
              <a
                href={`https://${stagiaire.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-blue-600 hover:underline"
              >
                <Linkedin className="h-3.5 w-3.5" />
                {stagiaire.linkedin}
              </a>
            ) : (
              "—"
            )
          }
        />

        <Field
          label="GitHub"
          value={
            stagiaire.github ? (
              <a
                href={`https://${stagiaire.github}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-blue-600 hover:underline"
              >
                <Github className="h-3.5 w-3.5" />
                {stagiaire.github}
              </a>
            ) : (
              "—"
            )
          }
        />
      </div>

      <div className="space-y-5">
        <h4 className="font-semibold text-slate-900">Formation</h4>

        <Field label="Établissement" value={stagiaire.ecole} />
        <Field label="Filière" value={stagiaire.filiere} />
        <Field label="Département d'accueil" value={stagiaire.departement} />
        <Field label="Encadrant" value={stagiaire.encadrantName ?? "Non affecté"} />
        <Field label="Biographie" value={stagiaire.bio ?? "—"} />
      </div>
    </div>
  );
}