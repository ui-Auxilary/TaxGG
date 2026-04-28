type ResultVariant = "total" | "accent" | "muted";

interface ResultRowProps {
  label: string;
  value: string;
  variant?: ResultVariant;
}

const variantClass: Record<ResultVariant, string> = {
  total: "total",
  accent: "accent-row",
  muted: "muted-row",
};

export function ResultRow({ label, value, variant }: ResultRowProps) {
  const className = ["row", variant && variantClass[variant]].filter(Boolean).join(" ");
  return (
    <div className={className}>
      <span className="lbl">{label}</span>
      <span className="val">{value}</span>
    </div>
  );
}
