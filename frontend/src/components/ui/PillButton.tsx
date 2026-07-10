"use client";

import Link from "next/link";
import { type ReactNode } from "react";

interface PillButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variants = {
  primary:
    "bg-brand-orange text-brand-navy hover:shadow-lg hover:shadow-brand-orange/30",
  outline:
    "border border-white/60 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
  dark: "bg-brand-navy text-white hover:bg-brand-navy/90",
};

const sizes = {
  sm: "h-9 px-5 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

/** CTA tipo píldora — inspirado en botones de la plantilla GoDominican */
export function PillButton({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: PillButtonProps) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full font-semibold uppercase tracking-wide transition-all duration-300 ease-godo ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "primary" && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-brand-orange-deep/40 to-transparent transition-transform duration-500 ease-godo group-hover:translate-x-0" />
      )}
    </Link>
  );
}
