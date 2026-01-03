import { SectionId, WorksheetData } from './types';

export const SECTION_TIMER_DURATION = 180; // 3 minutes

export const READING_TEXT = "John is 40 years old. He was born in Porto but now lives in Lisbon. He studied engineering and works in a tech company. In his free time, he enjoys hiking and reading science fiction books.";

export const SECTIONS = [
  { id: SectionId.PROFILE, label: '1. Personal Profile' },
  { id: SectionId.TIMELINE, label: '2. Life Journey Timeline' },
  { id: SectionId.LEARNING, label: '3. Formal and Informal Learning' },
  { id: SectionId.VALUES, label: '4. Personal Values and Identity' },
  { id: SectionId.READING, label: '5. Reading Comprehension' },
];

export const INITIAL_DATA: WorksheetData = {
  traineeName: '',
  traineeEmail: '',
  profile: '',
  timeline: [{ year: '', event: '' }],
  learning: { school: ['', ''], outside: ['', ''] },
  values: '',
  readingAnswers: { q1: '', q2: '', q3: '', q4: '', q5: '' }
};