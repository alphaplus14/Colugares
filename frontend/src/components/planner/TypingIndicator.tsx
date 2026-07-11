/** Indicador de escritura animado para Colu */
export default function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-1.5 px-1 py-0.5"
      aria-label="Colu está escribiendo"
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="h-2 w-2 rounded-full bg-brand-orange"
          style={{
            animation: "typing-dot 1.2s ease-in-out infinite",
            animationDelay: `${index * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}
