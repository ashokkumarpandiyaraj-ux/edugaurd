export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type FactorStrength = 'Low' | 'Medium' | 'High';

export interface FeatureFactor {
  label: string;
  contribution: number;
  strength: FactorStrength;
}

export interface Student {
  id: string;
  course: string;
  module: string;
  risk: RiskLevel;
  riskScore: number;
  engagement: number;
  lmsActivity: number;
  assessmentScore: number;
  lmsActivityChange: number;
  activeDaysChange: number;
  assessmentSubmissionChange: number;
  assessmentScoreChange: number;
  weeklyEngagement: number[];
  lmsClicks: number;
  activeDays: number;
  assessmentsSubmitted: number;
  studyCredits: number;
  previousAttempts: number;
  educationLevel: string;
  observedWeeks: number;
  trendDirection: 'up' | 'down' | 'steady';
  lastUpdated: string;
  factors: FeatureFactor[];
  supportSuggestion: string;
}

export interface TrendPoint {
  week: string;
  engagement: number;
  reference: number;
}

export interface CohortRiskPoint {
  name: RiskLevel;
  value: number;
  color: string;
}

export interface ApiHealth {
  status: 'ok' | 'unavailable';
  model_available: boolean;
  model_status: 'connected' | 'not_connected' | 'load_failed';
}

export interface PredictionInput {
  lms_clicks: number;
  active_days: number;
  assessments_submitted: number;
  avg_assessment_score: number;
  lms_clicks_change: number;
  active_days_change: number;
  avg_assessment_score_change: number;
}
