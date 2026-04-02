export interface Company {
  id: string;
  name: string;
  logoUrl: string;
}

export interface Question {
  id: string;
  questionNumber: number;
  companyId: string;
  companyName: string;
  companyLogoUrl: string;
  text: string;
  durationMinutes: number;
  completedTodayCount: number;
}

export interface KeyMoment {
  timestamp: string;
  description: string;
  type: "positive" | "negative";
}

/** Shape of `session-result.json` per README. */
export interface SessionResult {
  questionId: string;
  questionText: string;
  companyName: string;
  smartSummary: {
    whatWorkedWell: string[];
    overallTakeaways: string[];
  };
  keyMoments: KeyMoment[];
  audioDurationSeconds: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  avatarUrl: string;
}
