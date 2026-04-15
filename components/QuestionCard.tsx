"use client";

import { useState } from "react";

interface QuestionCardProps {
  text: string;
  options: Record<string, string>;
  optionKeys: string[];
  onAnswer: (key: string) => void;
  disabled?: boolean;
}

export function QuestionCard({
  text,
  options,
  optionKeys,
  onAnswer,
  disabled,
}: QuestionCardProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const handleClick = (key: string) => {
    if (disabled || selectedKey) return;
    setSelectedKey(key);
    onAnswer(key);
  };

  return (
    <div>
      {/* Question text */}
      <p className="mb-6 text-base font-medium leading-relaxed text-gray-900 md:mb-8 md:text-lg">
        {text}
      </p>

      {/* Options — ALL FOUR IDENTICAL IN DEFAULT STATE */}
      <div className="space-y-2 md:space-y-3">
        {optionKeys.map((key) => {
          const isSelected = selectedKey === key;
          const isDisabled = disabled && !isSelected;

          return (
            <button
              key={key}
              onClick={() => handleClick(key)}
              disabled={!!isDisabled}
              className={[
                "group w-full flex items-start gap-3 p-3 rounded-lg border text-left",
                "transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#EBF2FF]",
                "md:gap-4 md:p-4",
                isSelected
                  ? "border-[#0056D2] bg-[#EBF2FF] cursor-default"
                  : "border-gray-200 bg-white hover:border-[#0056D2] hover:bg-[#EBF2FF] cursor-pointer",
                isDisabled ? "opacity-40 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {/* Letter badge — identical for A, B, C, D */}
              <span
                className={[
                  "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded text-xs font-semibold transition-colors",
                  "md:h-8 md:w-8 md:text-sm",
                  isSelected
                    ? "bg-[#0056D2] text-white"
                    : "bg-gray-100 text-gray-600 group-hover:bg-[#EBF2FF] group-hover:text-[#0056D2]",
                ].join(" ")}
              >
                {key}
              </span>

              {/* Option text */}
              <span
                className={[
                  "pt-0.5 text-sm leading-relaxed",
                  isSelected ? "font-medium text-gray-900" : "text-gray-700",
                ].join(" ")}
              >
                {options[key]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
