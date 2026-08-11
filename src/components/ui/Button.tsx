import { ButtonHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

const VARIANTS: Record<string, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
  secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100",
  danger: "bg-red-50 text-red-700 hover:bg-red-100",
};

export function Button({ icon: Icon, variant = "primary", className = "", children, ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}
