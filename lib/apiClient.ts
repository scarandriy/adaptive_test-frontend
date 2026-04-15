const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function getBankStatus() {
  return request<{
    loaded: boolean;
    domain_counts: Record<string, number>;
  }>("/bank/status");
}

export async function createSession(body: {
  candidate_name: string;
  target_role: string;
  context: string;
}) {
  return request<{ session_id: string; started_at: string }>("/session/create", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getSession(sessionId: string) {
  return request<Record<string, unknown>>(`/session/${sessionId}`);
}

export async function getNextQuestion(sessionId: string) {
  return request<{
    finished: boolean;
    question: {
      code: string;
      domain: string;
      competency: string;
      target_level: number;
      cost: number;
      type: string;
      text: string;
      options: Record<string, string>;
      option_keys: string[];
      correct_answer: string;
      explanation: string;
    } | null;
    progress: {
      answered: number;
      total: number;
      stage: number;
      domain_counts: Record<string, number>;
    };
  }>(`/test/${sessionId}/next`);
}

export async function submitAnswer(
  sessionId: string,
  body: { question_code: string; answer: string; time_spent_sec: number }
) {
  return request<{
    domain_scores: Record<string, number>;
    uncertainty: Record<string, number>;
    stage: number;
    progress: {
      answered: number;
      total: number;
      stage: number;
      domain_counts: Record<string, number>;
    };
  }>(`/test/${sessionId}/answer`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getResult(sessionId: string) {
  return request<Record<string, unknown>>(`/session/${sessionId}/result`);
}

export function getReportUrl(sessionId: string) {
  return `${API_BASE}/report/${sessionId}`;
}
