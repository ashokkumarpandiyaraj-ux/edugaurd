import type { CohortRiskPoint, FeatureFactor, RiskLevel, Student, TrendPoint } from './types';

type StudentSeed = Pick<Student, 'id' | 'risk' | 'riskScore' | 'engagement' | 'lmsActivity' | 'assessmentScore' | 'course' | 'module'> &
  Partial<Pick<Student, 'lmsActivityChange' | 'activeDaysChange' | 'assessmentSubmissionChange' | 'assessmentScoreChange' | 'lmsClicks' | 'activeDays' | 'assessmentsSubmitted' | 'studyCredits' | 'previousAttempts' | 'educationLevel' | 'observedWeeks' | 'lastUpdated'>>;

const coursePairs = [
  ['Mathematics', 'MTH-101'],
  ['Computer Science', 'CSC-102'],
  ['Physics', 'PHY-112'],
  ['Statistics', 'STA-204'],
  ['Biology', 'BIO-110'],
] as const;

function factorsFor(risk: RiskLevel): FeatureFactor[] {
  const values = risk === 'HIGH' ? [92, 84, 64, 52] : risk === 'MEDIUM' ? [68, 56, 43, 34] : [36, 29, 21, 15];
  return [
    { label: 'LMS activity decline', contribution: values[0], strength: values[0] >= 70 ? 'High' : values[0] >= 40 ? 'Medium' : 'Low' },
    { label: 'Assessment submission decline', contribution: values[1], strength: values[1] >= 70 ? 'High' : values[1] >= 40 ? 'Medium' : 'Low' },
    { label: 'Active learning day decline', contribution: values[2], strength: values[2] >= 70 ? 'High' : values[2] >= 40 ? 'Medium' : 'Low' },
    { label: 'Assessment score decline', contribution: values[3], strength: values[3] >= 70 ? 'High' : values[3] >= 40 ? 'Medium' : 'Low' },
  ];
}

function makeStudent(seed: StudentSeed, index: number): Student {
  const riskDefaults = seed.risk === 'HIGH'
    ? { lms: -20, active: -18, submission: -22, score: -11, delta: -13 }
    : seed.risk === 'MEDIUM'
      ? { lms: -11, active: -9, submission: -12, score: -6, delta: -7 }
      : { lms: 5, active: 3, submission: 4, score: 2, delta: 2 };
  const lmsActivityChange = seed.lmsActivityChange ?? riskDefaults.lms;
  const activeDaysChange = seed.activeDaysChange ?? riskDefaults.active;
  const assessmentSubmissionChange = seed.assessmentSubmissionChange ?? riskDefaults.submission;
  const assessmentScoreChange = seed.assessmentScoreChange ?? riskDefaults.score;
  const direction = riskDefaults.delta;
  const start = Math.min(96, Math.max(28, seed.engagement - direction + ((index % 3) - 1)));
  const weeklyEngagement = Array.from({ length: 8 }, (_, week) => Math.round(start + (seed.engagement - start) * (week / 7)));
  weeklyEngagement[7] = seed.engagement;

  const supportSuggestion = seed.risk === 'HIGH'
    ? 'Consider a mentor check-in to understand any barriers and explore assignment support or academic guidance that feels useful to the student.'
    : seed.risk === 'MEDIUM'
      ? 'A brief, supportive check-in may help clarify whether the student would benefit from assignment guidance or closer monitoring.'
      : 'Continue routine encouragement and monitor engagement over the next 1–2 weeks; no urgent intervention is indicated by this demo signal.';

  return {
    ...seed,
    lmsActivityChange,
    activeDaysChange,
    assessmentSubmissionChange,
    assessmentScoreChange,
    weeklyEngagement,
    lmsClicks: seed.lmsClicks ?? Math.max(60, Math.round(seed.lmsActivity * 2.5)),
    activeDays: seed.activeDays ?? Math.max(5, Math.round(seed.engagement / 4)),
    assessmentsSubmitted: seed.assessmentsSubmitted ?? Math.max(1, Math.round(seed.assessmentScore / 18)),
    studyCredits: seed.studyCredits ?? (index % 2 === 0 ? 60 : 30),
    previousAttempts: seed.previousAttempts ?? (index % 6 === 0 ? 1 : 0),
    educationLevel: seed.educationLevel ?? (index % 3 === 0 ? 'A-Level' : index % 3 === 1 ? 'HE Qualification' : 'Other'),
    observedWeeks: seed.observedWeeks ?? 8,
    trendDirection: seed.risk === 'HIGH' ? 'down' : seed.risk === 'LOW' ? 'up' : 'down',
    lastUpdated: seed.lastUpdated ?? (index % 4 === 0 ? '2h ago' : 'Today'),
    factors: factorsFor(seed.risk),
    supportSuggestion,
  };
}

const seeds: StudentSeed[] = [
  { id: 'STU-1001', risk: 'LOW', riskScore: 18, engagement: 84, lmsActivity: 91, assessmentScore: 82, course: 'Mathematics', module: 'MTH-101' },
  { id: 'STU-1002', risk: 'LOW', riskScore: 21, engagement: 88, lmsActivity: 95, assessmentScore: 76, course: 'Computer Science', module: 'CSC-102' },
  { id: 'STU-1003', risk: 'MEDIUM', riskScore: 54, engagement: 70, lmsActivity: 65, assessmentScore: 68, course: 'Physics', module: 'PHY-112' },
  { id: 'STU-1004', risk: 'LOW', riskScore: 14, engagement: 79, lmsActivity: 88, assessmentScore: 74, course: 'Biology', module: 'BIO-110' },
  { id: 'STU-1005', risk: 'HIGH', riskScore: 72, engagement: 59, lmsActivity: 58, assessmentScore: 61, course: 'Mathematics', module: 'MTH-101' },
  { id: 'STU-1006', risk: 'MEDIUM', riskScore: 49, engagement: 68, lmsActivity: 72, assessmentScore: 64, course: 'Statistics', module: 'STA-204' },
  { id: 'STU-1007', risk: 'LOW', riskScore: 16, engagement: 82, lmsActivity: 91, assessmentScore: 79, course: 'Computer Science', module: 'CSC-102' },
  { id: 'STU-1008', risk: 'LOW', riskScore: 12, engagement: 77, lmsActivity: 84, assessmentScore: 71, course: 'Physics', module: 'PHY-112' },
  { id: 'STU-1009', risk: 'MEDIUM', riskScore: 46, engagement: 66, lmsActivity: 69, assessmentScore: 59, course: 'Biology', module: 'BIO-110' },
  { id: 'STU-1010', risk: 'HIGH', riskScore: 69, engagement: 56, lmsActivity: 55, assessmentScore: 58, course: 'Statistics', module: 'STA-204' },
  { id: 'STU-1011', risk: 'LOW', riskScore: 22, engagement: 85, lmsActivity: 93, assessmentScore: 85, course: 'Mathematics', module: 'MTH-101' },
  { id: 'STU-1012', risk: 'MEDIUM', riskScore: 52, engagement: 71, lmsActivity: 66, assessmentScore: 63, course: 'Computer Science', module: 'CSC-102' },
  { id: 'STU-1013', risk: 'LOW', riskScore: 15, engagement: 80, lmsActivity: 89, assessmentScore: 81, course: 'Physics', module: 'PHY-112' },
  { id: 'STU-1014', risk: 'MEDIUM', riskScore: 43, engagement: 64, lmsActivity: 61, assessmentScore: 57, course: 'Statistics', module: 'STA-204' },
  { id: 'STU-1015', risk: 'LOW', riskScore: 19, engagement: 83, lmsActivity: 91, assessmentScore: 78, course: 'Biology', module: 'BIO-110' },
  { id: 'STU-1016', risk: 'HIGH', riskScore: 75, engagement: 51, lmsActivity: 54, assessmentScore: 56, course: 'Mathematics', module: 'MTH-101' },
  { id: 'STU-1017', risk: 'LOW', riskScore: 9, engagement: 74, lmsActivity: 82, assessmentScore: 69, course: 'Computer Science', module: 'CSC-102' },
  { id: 'STU-1018', risk: 'MEDIUM', riskScore: 41, engagement: 67, lmsActivity: 65, assessmentScore: 60, course: 'Physics', module: 'PHY-112' },
  { id: 'STU-1019', risk: 'LOW', riskScore: 14, engagement: 81, lmsActivity: 90, assessmentScore: 76, course: 'Statistics', module: 'STA-204' },
  { id: 'STU-1020', risk: 'LOW', riskScore: 17, engagement: 78, lmsActivity: 87, assessmentScore: 72, course: 'Biology', module: 'BIO-110' },
  { id: 'STU-1023', risk: 'HIGH', riskScore: 78, engagement: 54, lmsActivity: 62, assessmentScore: 62, course: 'Mathematics', module: 'MTH-101', lmsActivityChange: -25, activeDaysChange: -20, assessmentSubmissionChange: -30, assessmentScoreChange: -12, lmsClicks: 120, activeDays: 18, assessmentsSubmitted: 4, lastUpdated: 'Today' },
  { id: 'STU-1045', risk: 'HIGH', riskScore: 74, engagement: 58, lmsActivity: 66, assessmentScore: 64, course: 'Computer Science', module: 'CSC-102', activeDaysChange: -22, assessmentScoreChange: -15 },
  { id: 'STU-1088', risk: 'MEDIUM', riskScore: 61, engagement: 63, lmsActivity: 69, assessmentScore: 66, course: 'Physics', module: 'PHY-112', lmsActivityChange: -14 },
  { id: 'STU-1102', risk: 'MEDIUM', riskScore: 57, engagement: 69, lmsActivity: 72, assessmentScore: 71, course: 'Statistics', module: 'STA-204', assessmentSubmissionChange: -12 },
];

export const students: Student[] = seeds.map(makeStudent);
export const studentsById = new Map(students.map((student) => [student.id, student]));
export const courseOptions = [...new Set(seeds.map((student) => student.course))].sort();
export const courseModuleOptions = [...new Set(seeds.flatMap((student) => [student.course, student.module]))].sort();

export const cohortRisk: CohortRiskPoint[] = [
  { name: 'LOW', value: 415, color: '#49d6a0' },
  { name: 'MEDIUM', value: 61, color: '#f0b84a' },
  { name: 'HIGH', value: 24, color: '#fa6572' },
];

export const engagementTrend: TrendPoint[] = [
  { week: 'Week 1', engagement: 82, reference: 86 },
  { week: 'Week 2', engagement: 80, reference: 85 },
  { week: 'Week 3', engagement: 78, reference: 84 },
  { week: 'Week 4', engagement: 75, reference: 83 },
  { week: 'Week 5', engagement: 72, reference: 82 },
  { week: 'Week 6', engagement: 69, reference: 81 },
  { week: 'Week 7', engagement: 67, reference: 80 },
  { week: 'Week 8', engagement: 64, reference: 79 },
];

export const alertIds = ['STU-1023', 'STU-1045', 'STU-1088', 'STU-1102'];
