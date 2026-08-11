// src/components/ui/StatusToggle.tsx
interface StatusToggleProps {
  active: boolean;
  onChange: (active: boolean) => void;
  disabled?: boolean;
}

export function StatusToggle({ active, onChange, disabled }: StatusToggleProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!active)}
      className={`inline-flex items-center gap-2 text-xs font-medium ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      title={active ? "Cliquer pour désactiver le compte" : "Cliquer pour activer le compte"}
    >
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          active ? "bg-emerald-500" : "bg-slate-300"
        }`}
      >
        <span
          className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
          style={{ transform: active ? "translateX(18px)" : "translateX(4px)" }}
        />
      </span>
      <span className={active ? "text-emerald-700" : "text-slate-500"}>{active ? "Actif" : "Inactif"}</span>
    </button>
  );
}