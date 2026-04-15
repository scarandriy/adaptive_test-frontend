import { create } from "zustand";

interface SessionUiState {
  domainScores: Record<string, number>;
  uncertainty: Record<string, number>;
  stage: number;
  answered: number;
  total: number;
  domainCounts: Record<string, number>;
  setProgress: (p: {
    domain_scores?: Record<string, number>;
    uncertainty?: Record<string, number>;
    stage?: number;
    progress?: {
      answered?: number;
      total?: number;
      stage?: number;
      domain_counts?: Record<string, number>;
    };
  }) => void;
}

export const useSessionUi = create<SessionUiState>((set) => ({
  domainScores: {},
  uncertainty: {},
  stage: 1,
  answered: 0,
  total: 100,
  domainCounts: {},
  setProgress: (p) =>
    set((s) => ({
      domainScores: p.domain_scores ?? s.domainScores,
      uncertainty: p.uncertainty ?? s.uncertainty,
      stage: p.progress?.stage ?? p.stage ?? s.stage,
      answered: p.progress?.answered ?? s.answered,
      total: p.progress?.total ?? s.total,
      domainCounts: p.progress?.domain_counts ?? s.domainCounts,
    })),
}));
