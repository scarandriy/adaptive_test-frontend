"use client";

interface ProfileBadgeProps {
  label: string;
  confidence: string;
  description?: string;
  variant?: "primary" | "secondary";
}

const CONFIDENCE_BADGE: Record<string, { text: string; cls: string }> = {
  high:   { text: "High Confidence",   cls: "bg-[#E6F7F2] text-[#0A7A55]" },
  medium: { text: "Medium Confidence", cls: "bg-[#FEF3DC] text-[#92570A]" },
  low:    { text: "Low Confidence",    cls: "bg-[#FDECEA] text-[#C0392B]" },
};

export function ProfileBadge({
  label,
  confidence,
  description,
  variant = "primary",
}: ProfileBadgeProps) {
  const cb          = CONFIDENCE_BADGE[confidence.toLowerCase()] ?? CONFIDENCE_BADGE.medium;
  const isPrimary   = variant === "primary";

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6 ${isPrimary ? "border-l-4 border-l-[#0056D2] pl-5 md:pl-6" : "border-l-4 border-l-gray-200 pl-5 md:pl-6"}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          {isPrimary ? "Primary Profile" : "Secondary Profile"}
        </p>
        <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${cb.cls}`}>
          {cb.text}
        </span>
      </div>

      <h3 className="mt-1 text-xl font-bold text-gray-900 md:text-2xl">{label}</h3>

      {description && (
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
      )}
    </div>
  );
}
