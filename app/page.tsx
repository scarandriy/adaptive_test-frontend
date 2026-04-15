"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSession } from "@/lib/apiClient";

const CONTEXTS = [
  { value: "hiring",              label: "Executive Hiring" },
  { value: "internal_assessment", label: "Internal Assessment" },
  { value: "promotion",           label: "Promotion Review" },
  { value: "self_assessment",     label: "Self Assessment" },
  { value: "partner_assessment",  label: "Partner Assessment" },
];

const STATS = [
  { value: "1 000", label: "Questions" },
  { value: "5",     label: "Domains" },
  { value: "4",     label: "Difficulty Levels" },
  { value: "60–90", label: "Min. Estimated Time" },
];

const DOMAINS = [
  { key: "business",        label: "Business Strategy",  color: "#3B82F6", count: "200 questions" },
  { key: "finance",         label: "Finance",            color: "#10B981", count: "200 questions" },
  { key: "technology",      label: "Technology",         color: "#8B5CF6", count: "200 questions" },
  { key: "marketing_sales", label: "Marketing & Sales",  color: "#F59E0B", count: "200 questions" },
  { key: "psychology",      label: "Psychology",         color: "#F43F5E", count: "200 questions" },
];

const STEPS = [
  {
    title: "Calibration",
    desc: "First 25 questions create a baseline across all 5 domains.",
  },
  {
    title: "Refinement",
    desc: "Next 35 questions target zones of highest uncertainty.",
  },
  {
    title: "Verification",
    desc: "Final 40 questions confirm strengths and expose contradictions.",
  },
];

/* Border classes per stat cell (2-col mobile → 4-col desktop) */
const STAT_BORDER = [
  "border-r border-b md:border-b-0 border-gray-200",
  "border-b md:border-b-0 md:border-r border-gray-200",
  "border-r border-gray-200",
  "",
];

export default function HomePage() {
  const router = useRouter();
  const [candidateName, setCandidateName] = useState("");
  const [targetRole,    setTargetRole]    = useState("");
  const [context,       setContext]       = useState("hiring");
  const [creating,      setCreating]      = useState(false);
  const [error,         setError]         = useState<string | null>(null);

  const handleStart = async () => {
    if (!candidateName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await createSession({
        candidate_name: candidateName.trim(),
        target_role:    targetRole.trim(),
        context,
      });
      router.push(`/test/${res.session_id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to start session");
      setCreating(false);
    }
  };

  return (
    <div className="px-4 py-8 md:px-8 md:py-12 lg:px-12 xl:px-16">

      {/* ── Section 1: Page header ──────────────────────────── */}
      <div className="mb-8 animate-fade-up">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Competency Assessment
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
          Top Manager Assessment
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-500">
          Adaptive multi-domain evaluation across five competency areas.
          100 questions · 60–90 minutes · Full profile report.
        </p>
      </div>

      {/* ── Section 2: Stats strip ──────────────────────────── */}
      <div className="animate-fade-up stagger-1 mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className={`px-6 py-5 text-center ${STAT_BORDER[i]}`}>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="mt-1 text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: Domains + Form ───────────────────────── */}
      <div className="animate-fade-up stagger-2 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Domains card — right on desktop, second on mobile */}
        <div className="order-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6 lg:order-1">
          <h2 className="mb-5 text-lg font-semibold text-gray-900 md:text-xl">
            Assessment Domains
          </h2>
          <div className="space-y-1">
            {DOMAINS.map((d) => (
              <div key={d.key} className="flex items-center gap-3 py-2">
                <div className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ background: d.color }} />
                <span className="text-sm font-medium text-gray-900">{d.label}</span>
                <span className="ml-auto text-xs text-gray-400">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form card — left on desktop, first on mobile */}
        <div className="order-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6 lg:order-2">
          <h2 className="mb-1 text-lg font-semibold text-gray-900 md:text-xl">
            Begin Assessment
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            Enter your details to begin the evaluation.
          </p>

          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                placeholder="e.g. Alexandra Novak"
                autoFocus
                className="w-full rounded border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-150 focus:border-[#0056D2] focus:outline-none focus:ring-2 focus:ring-[#EBF2FF]"
              />
            </div>

            {/* Role */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Target Role{" "}
                <span className="ml-1 text-xs font-normal text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="CEO · COO · CFO · CTO · VP..."
                className="w-full rounded border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-150 focus:border-[#0056D2] focus:outline-none focus:ring-2 focus:ring-[#EBF2FF]"
              />
              <p className="mt-1 text-xs text-gray-400">Used to contextualise the report</p>
            </div>

            {/* Context */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Assessment Purpose
              </label>
              <select
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors duration-150 focus:border-[#0056D2] focus:outline-none focus:ring-2 focus:ring-[#EBF2FF]"
              >
                {CONTEXTS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                {error}
              </p>
            )}

            {/* CTA */}
            <button
              onClick={handleStart}
              disabled={!candidateName.trim() || creating}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded bg-[#0056D2] text-sm font-medium text-white transition-colors duration-150 hover:bg-[#0041A8] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-400"
            >
              {creating ? (
                <><span className="spinner" /> Starting Assessment…</>
              ) : (
                "Start Assessment →"
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              Session is saved automatically
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 4: How it works ─────────────────────────── */}
      <div className="animate-fade-up stagger-3 mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
        <h3 className="mb-6 text-base font-semibold text-gray-900">
          How the adaptive engine works
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={i}>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EBF2FF] text-xs font-bold text-[#0056D2]">
                {i + 1}
              </div>
              <h4 className="mt-3 text-sm font-semibold text-gray-900">{step.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
