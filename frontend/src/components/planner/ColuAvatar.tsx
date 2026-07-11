import { cn } from "@/lib/utils";

interface ColuAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  pulse?: boolean;
}

const sizeClasses = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-14 w-14 text-xl",
};

/** Avatar de Colu — guía turística IA */
export default function ColuAvatar({
  size = "md",
  className,
  pulse = false,
}: ColuAvatarProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-colombia-green to-colombia-green-dark font-bold text-white shadow-glow-green",
        sizeClasses[size],
        pulse && "animate-pulse-soft",
        className,
      )}
      aria-hidden
    >
      <span>C</span>
      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-colombia-gold" />
    </div>
  );
}
