"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getResult, getReportUrl } from "@/lib/apiClient";
import { DomainRadar } from "@/components/DomainRadar";

interface DomainScore {
  domain: string;
  score_0_100: number;
  estimated_level: number;
  estimated_level_label: string;
  questions_answered: number;
}

interface Profile {
  primary_profile: string;
  primary_profile_label: string;
  primary_profile_description: string;
  secondary_profile: string | null;
  secondary_profile_label: string | null;
  secondary_profile_description: string | null;
  primary_profile_confidence: string;
}

interface ReportData {
  candidate_name?: string;
  executive_summary: {
    headline: string;
    primary_conclusion: string;
    management_readiness_level: string;
  };
  domain_scores: DomainScore[];
  profile: Profile;
  strengths: string[];
  limitations: string[];
  recommendations: string[];
  can_solve: string[];
  not_recommended_for: string[];
  recommended_roles: string[];
  risky_roles: string[];
  quality_flags: {
    data_quality: string;
    simulation_risk: string;
    interpretation_limits: string;
  };
}

const DOMAIN_LABELS: Record<string, string> = {
  business:        "Business",
  finance:         "Finance",
  technology:      "Technology",
  marketing_sales: "Marketing & Sales",
  psychology:      "Psychology",
};

/* Bar colors matching dot colors on home page */
const DOMAIN_BAR_COLOR: Record<string, string> = {
  business:        "#3B82F6",
  finance:         "#10B981",
  technology:      "#8B5CF6",
  marketing_sales: "#F59E0B",
  psychology:      "#F43F5E",
};

const READINESS: Record<string, { label: string; cls: string }> = {
  ready_for_top_management:      { label: "Ready for Top Management",  cls: "bg-[#E6F7F2] text-[#0A7A55] border border-[#0A7A55]/20" },
  strong_top_management_profile: { label: "Strong Top Management",     cls: "bg-[#E6F7F2] text-[#0A7A55] border border-[#0A7A55]/20" },
  conditionally_ready:           { label: "Conditionally Ready",       cls: "bg-[#EBF2FF] text-[#0056D2] border border-[#0056D2]/20" },
  top_management_potential:      { label: "Top Management Potential",  cls: "bg-[#EBF2FF] text-[#0056D2] border border-[#0056D2]/20" },
  cross_functional_manager:      { label: "Cross-Functional Manager",  cls: "bg-[#EBF2FF] text-[#0056D2] border border-[#0056D2]/20" },
  needs_development:             { label: "Needs Development",         cls: "bg-[#FEF3DC] text-[#92570A] border border-[#92570A]/20" },
  strong_functional_manager:     { label: "Strong Functional Manager", cls: "bg-[#FEF3DC] text-[#92570A] border border-[#92570A]/20" },
  not_ready:                     { label: "Not Ready",                 cls: "bg-[#FDECEA] text-[#C0392B] border border-[#C0392B]/20" },
  not_ready_for_top_management:  { label: "Not Ready",                 cls: "bg-[#FDECEA] text-[#C0392B] border border-[#C0392B]/20" },
  profile_not_confirmed:         { label: "Profile Not Confirmed",     cls: "bg-gray-100 text-gray-600 border border-gray-200" },
};

const CONFIDENCE_BADGE: Record<string, string> = {
  high:   "bg-[#E6F7F2] text-[#0A7A55]",
  medium: "bg-[#FEF3DC] text-[#92570A]",
  low:    "bg-[#FDECEA] text-[#C0392B]",
};

export default function ResultsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error,  setError]  = useState<string | null>(null);

  useEffect(() => {
    getResult(sessionId)
      .then((r) => setReport(r as unknown as ReportData))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load results"));
  }, [sessionId]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <p className="text-sm text-red-600">{error}</p>
        <Link href="/" className="text-sm text-[#0056D2] underline">← Back to home</Link>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-7 w-7 animate-[spin_0.7s_linear_infinite] rounded-full border-2 border-gray-200 border-t-[#0056D2]" />
        <p className="text-sm text-gray-500">Compiling assessment report…</p>
      </div>
    );
  }

  const { executive_summary: es, profile, domain_scores } = report;
  const rlKey  = es.management_readiness_level ?? "profile_not_confirmed";
  const rl     = READINESS[rlKey] ?? READINESS.profile_not_confirmed;
  const radScores = Object.fromEntries(domain_scores.map((d) => [d.domain, d.score_0_100]));
  const confBadge = CONFIDENCE_BADGE[profile.primary_profile_confidence?.toLowerCase()] ?? CONFIDENCE_BADGE.medium;

  return (
    <div className="px-4 py-8 md:px-8 md:py-12 lg:px-12 xl:px-16">

      {/* ── Section 1: Header ────────────────────────────────── */}
      <div className="animate-fade-up mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#0A7A55]">
            Assessment Complete
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            {report.candidate_name ? `Assessment of ${report.candidate_name}` : es.headline}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {profile.primary_profile_label} · {profile.primary_profile_confidence} confidence
          </p>
        </div>

        <div className={`flex-shrink-0 self-start rounded-lg px-4 py-2 text-sm font-semibold ${rl.cls}`}>
          {rl.label}
        </div>
      </div>

      {/* ── Section 2: Domain scores + radar ────────────────── */}
      <div className="animate-fade-up stagger-1 mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Scores — spans 2 cols on desktop */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6 lg:col-span-2">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Domain Scores
          </p>
          <div className="space-y-4 md:space-y-5">
            {domain_scores.map((ds) => (
              <div key={ds.domain}>
                <div className="mb-1 flex items-center">
                  <span className="flex-1 text-sm font-semibold text-gray-900">
                    {DOMAIN_LABELS[ds.domain] ?? ds.domain}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{ds.score_0_100}%</span>
                  <span className="ml-2 text-xs text-gray-400">L{ds.estimated_level.toFixed(1)}</span>
                </div>
                <p className="mb-1.5 text-xs text-gray-400">
                  {ds.estimated_level_label} · {ds.questions_answered}q answered
                </p>
                <div className="h-1.5 w-full rounded-full bg-gray-100">
                  <div
                    className="score-fill"
                    style={{
                      width: `${ds.score_0_100}%`,
                      background: DOMAIN_BAR_COLOR[ds.domain] ?? "#3B82F6",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Radar — 1 col */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Domain Profile
          </p>
          <div className="mx-auto" style={{ maxWidth: 280 }}>
            <DomainRadar
              scores={radScores}
              height={260}
              outerRadius={100}
              tickFontSize={11}
              margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
              shortTicks={false}
            />
          </div>
        </div>
      </div>

      {/* ── Section 3: Primary profile ───────────────────────── */}
      <div className="animate-fade-up stagger-2 mb-6 rounded-lg border border-gray-200 bg-white pl-5 shadow-sm md:pl-6" style={{ borderLeftWidth: 4, borderLeftColor: "#0056D2" }}>
        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Primary Profile
            </p>
            <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${confBadge}`}>
              {profile.primary_profile_confidence} confidence
            </span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-gray-900 md:text-2xl">
            {profile.primary_profile_label}
          </h2>
          {profile.primary_profile_description && (
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {profile.primary_profile_description}
            </p>
          )}
        </div>
      </div>

      {/* Secondary profile (if present) */}
      {profile.secondary_profile && profile.secondary_profile_label && (
        <div className="animate-fade-up stagger-2 mb-6 rounded-lg border border-gray-200 bg-white pl-5 shadow-sm md:pl-6" style={{ borderLeftWidth: 4, borderLeftColor: "#E5E7EB" }}>
          <div className="p-4 md:p-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Secondary Profile
            </p>
            <h2 className="text-xl font-bold text-gray-900">{profile.secondary_profile_label}</h2>
            {profile.secondary_profile_description && (
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {profile.secondary_profile_description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Section 4: Capability map ────────────────────────── */}
      {(report.can_solve.length > 0 || report.not_recommended_for.length > 0) && (
        <div className="animate-fade-up stagger-3 mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <h3 className="mb-5 text-base font-semibold text-gray-900">Capability Map</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {report.can_solve.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0A7A55]">
                  Can Solve
                </p>
                <div className="space-y-2">
                  {report.can_solve.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-4 flex-shrink-0 text-sm text-[#0A7A55]">✓</span>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {report.not_recommended_for.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#C0392B]">
                  Not Recommended For
                </p>
                <div className="space-y-2">
                  {report.not_recommended_for.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-4 flex-shrink-0 text-sm text-[#C0392B]">✕</span>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Section 5: Role recommendations ─────────────────── */}
      {(report.recommended_roles.length > 0 || report.risky_roles.length > 0) && (
        <div className="animate-fade-up stagger-4 mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900">Role Recommendations</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {report.recommended_roles.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Recommended Roles
                </p>
                <div className="flex flex-wrap gap-2">
                  {report.recommended_roles.map((r, i) => (
                    <span key={i} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {report.risky_roles.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Roles to Avoid
                </p>
                <div className="flex flex-wrap gap-2">
                  {report.risky_roles.map((r, i) => (
                    <span key={i} className="rounded-full bg-[#FDECEA] px-3 py-1.5 text-xs font-medium text-[#C0392B]">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Section 6: Actions ───────────────────────────────── */}
      <div className="animate-fade-up stagger-4 flex flex-col gap-3 md:flex-row md:justify-end">
        <Link
          href="/"
          className="flex h-11 items-center justify-center rounded border border-[#0056D2] px-5 text-sm font-medium text-[#0056D2] transition-colors duration-150 hover:bg-[#EBF2FF]"
        >
          ← Back to Home
        </Link>
        <a
          href={getReportUrl(sessionId)}
          className="flex h-11 items-center justify-center rounded bg-[#0056D2] px-5 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#0041A8]"
        >
          Download Report →
        </a>
      </div>
    </div>
  );
}
