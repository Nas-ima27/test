const COLORS = ["bg-blue-600", "bg-violet-600", "bg-amber-500", "bg-teal-600", "bg-rose-500", "bg-indigo-600"];

interface AvatarProps {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ name, color, size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const bg = color ?? COLORS[name.length % COLORS.length];
  const sizeCls = size === "sm" ? "h-7 w-7 text-[10px]" : size === "lg" ? "h-14 w-14 text-base" : "h-9 w-9 text-xs";

  return (
    <div className={`shrink-0 rounded-full ${bg} text-white flex items-center justify-center font-semibold ${sizeCls}`}>
      {initials}
    </div>
  );
}
