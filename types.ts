export enum SectionId {
  WELCOME = 'welcome',
  PROFILE = 'profile',
  TIMELINE = 'timeline',
  LEARNING = 'learning',
  VALUES = 'values',
  READING = 'reading',
  RESULTS = 'results'
}

export interface TimelineItem {
  year: string;
  event: string;
}

export interface WorksheetData {
  traineeName: string;
  traineeEmail: string;
  profile: string;
  timeline: TimelineItem[];
  learning: {
    school: string[];
    outside: string[];
  };
  values: string;
  readingAnswers: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
  };
}

export interface SectionScore {
  percentage: number;
  status: 'success' | 'warning' | 'error';
  feedback: string;
  corrections: string[];
  suggestions: string[];
}