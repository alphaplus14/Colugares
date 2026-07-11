import Image from "next/image";
import { cn } from "@/lib/utils";

interface ColuAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  pulse?: boolean;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const iconClasses = {
  sm: "h-5 w-auto",
  md: "h-6 w-auto",
  lg: "h-8 w-auto",
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
        "relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy to-brand-navy/80 shadow-lg shadow-brand-navy/30",
        sizeClasses[size],
        pulse && "animate-pulse-soft",
        className,
      )}
      aria-hidden
    >
      <Image
        src="/brand/colu.png"
        alt=""
        width={263}
        height={233}
        className={cn("object-contain", iconClasses[size])}
      />
      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-orange" />
    </div>
  );
}
