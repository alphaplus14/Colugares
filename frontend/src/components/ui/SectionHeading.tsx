interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={`max-w-3xl ${alignClass}`}>
      <p
        className={`mb-3 text-xs font-semibold uppercase tracking-[0.25em] ${
          light ? "text-brand-orange" : "text-brand-orange-deep"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`text-display-md ${light ? "text-white" : "text-brand-navy"}`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            light ? "text-white/75" : "text-brand-navy/70"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
