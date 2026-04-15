"use client";

interface ProgressBarProps {
  answered: number;
  total: number;
  stage: number;
}

const STAGE_NAMES: Record<number, string> = {
  1: "Calibration",
  2: "Exploration",
  3: "Deep Dive",
  4: "Verification",
};

export function ProgressBar({ answered, total, stage }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((answered / total) * 100));

  return (
    <>
      {/* Left: stage */}
      <div className="flex flex-shrink-0 items-center gap-2">
        <span className="rounded-full bg-[#EBF2FF] px-2.5 py-1 text-xs font-semibold text-[#0056D2]">
          Stage {stage}
        </span>
        <span className="hidden text-sm text-gray-600 sm:block">
          {STAGE_NAMES[stage] ?? "Assessment"}
        </span>
      </div>

      {/* Center: track */}
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-[#0056D2] transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Right: counter */}
      <div className="flex-shrink-0 text-sm text-gray-500">
        <span className="hidden sm:inline">{answered} / {total}</span>
        <span className="sm:hidden">{answered}/{total}</span>
      </div>
    </>
  );
}
