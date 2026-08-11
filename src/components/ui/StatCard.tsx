import { LucideIcon, TrendingUp } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  tint: string;
}

export function StatCard({ label, value, icon: Icon, trend, tint }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${tint}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" /> {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 mt-4">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}
