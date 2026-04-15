"use client";

import { useEffect, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getNextQuestion, submitAnswer } from "@/lib/apiClient";
import { useSessionUi } from "@/store/session";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { DomainRadar } from "@/components/DomainRadar";

interface Question {
  code: string;
  domain: string;
  competency?: string;
  type: string;
  text: string;
  options: Record<string, string>;
  option_keys: string[];
}

const DOMAIN_LABELS: Record<string, string> = {
  business:        "Business",
  finance:         "Finance",
  technology:      "Technology",
  marketing_sales: "Marketing & Sales",
  psychology:      "Psychology",
};

export default function TestPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId }   = use(params);
  const router          = useRouter();
  const { domainScores, stage, answered, total, setProgress } = useSessionUi();

  const [question,   setQuestion]   = useState<Question | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [elapsed,    setElapsed]    = useState(0);

  const startTime = useRef(Date.now());
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setElapsed(0);
    startTime.current = Date.now();
    timerRef.current  = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
  };

  const fetchNext = async () => {
    setLoading(true);
    try {
      const res = await getNextQuestion(sessionId);
      if (res.finished) {
        if (timerRef.current) clearInterval(timerRef.current);
        router.push(`/results/${sessionId}`);
        return;
      }
      if (res.question) {
        setQuestion(res.question);
        if (res.progress) setProgress({ progress: res.progress });
      }
      startTimer();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNext();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = async (key: string) => {
    if (!question || submitting) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);
    const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
    try {
      const res = await submitAnswer(sessionId, {
        question_code:  question.code,
        answer:         key,
        time_spent_sec: timeSpent,
      });
      setProgress(res);
      await fetchNext();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !question) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-7 w-7 animate-[spin_0.7s_linear_infinite] rounded-full border-2 border-gray-200 border-t-[#0056D2]" />
        <p className="text-sm text-gray-500">Loading question…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-56px)] bg-gray-50 md:min-h-[calc(100dvh-64px)]">

      {/* ── Sticky progress bar ──────────────────────────────── */}
      <div className="sticky top-14 z-40 h-14 border-b border-gray-200 bg-white md:top-16 md:h-16">
        <div className="flex h-full items-center gap-4 px-4 md:px-8 lg:px-12 xl:px-16">
          <ProgressBar answered={answered} total={total} stage={stage} />
        </div>
      </div>

      {/* ── Main area ────────────────────────────────────────── */}
      <div className="w-full px-4 py-8 md:px-8 lg:mx-auto lg:max-w-5xl lg:px-8 xl:px-0">
        <div className="flex flex-col lg:flex-row lg:gap-10">

        {/* Question column */}
        <div className="min-w-0 flex-1">

          {/* Meta row — full width within column */}
          {question && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {/* Domain badge */}
              <span className="rounded-full bg-[#EBF2FF] px-2.5 py-1 text-xs font-semibold text-[#0056D2]">
                {DOMAIN_LABELS[question.domain] ?? question.domain}
              </span>

              {/* Competency */}
              {question.competency && (
                <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-500">
                  {question.competency}
                </span>
              )}

              {/* Type */}
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
                {question.type}
              </span>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Timer */}
              <span className={`font-mono text-sm tabular-nums ${elapsed > 120 ? "text-amber-600" : "text-gray-500"}`}>
                {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}
              </span>

              {/* Q counter — hidden on mobile */}
              <span className="hidden text-sm text-gray-400 sm:block">
                Q{answered + 1}
              </span>
            </div>
          )}

          {/* Question + options — capped at max-w-2xl */}
          {question && (
            <QuestionCard
              key={question.code}
              text={question.text}
              options={question.options}
              optionKeys={question.option_keys}
              onAnswer={handleAnswer}
              disabled={submitting}
            />
          )}
        </div>

        {/* Sidebar — visible lg+ */}
        <aside className="hidden flex-shrink-0 lg:block lg:w-64 xl:w-72">
          <div className="sticky top-20 space-y-3">

            {/* Radar chart card */}
            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Domain Profile
              </p>
              <DomainRadar
                scores={domainScores}
                height={180}
                outerRadius={68}
                tickFontSize={10}
                margin={{ top: 8, right: 18, bottom: 8, left: 18 }}
                shortTicks
              />
            </div>

            {/* Session info — plain text, no card */}
            <div>
              <p className="text-xs text-gray-400">Session</p>
              <p className="font-mono text-xs text-gray-400">
                {sessionId.slice(0, 8)}
              </p>
            </div>

          </div>
        </aside>
        </div>
      </div>
    </div>
  );
}
