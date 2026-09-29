import { useEffect, useState } from 'react';
import { students as demoStudents } from '../data';
import type { FeatureFactor, RiskLevel, Student } from '../types';
import { isSupabaseConfigured, supabase, supabaseSetupMessage } from './supabase';

type StudentRow = {
  id: string; external_student_id: string; name: string | null; course: string | null; module: string | null;
  education_level: string | null; hours_studied: number | null; attendance: number | null;
  previous_scores: number | null; risk_level: RiskLevel | null; risk_probability: number | null;
  updated_at: string;
};
export type PredictionHistory = { id: string; risk_level: RiskLevel; probability: number; model_version: string | null; created_at: string };

function factorsFor(risk: RiskLevel): FeatureFactor[] {
  const values = risk === 'HIGH' ? [92, 84, 64, 52] : risk === 'MEDIUM' ? [68, 56, 43, 34] : [36, 29, 21, 15];
  return ['LMS activity decline', 'Assessment submission decline', 'Active learning day decline', 'Assessment score decline']
    .map((label, index) => ({ label, contribution: values[index], strength: values[index] >= 70 ? 'High' : values[index] >= 40 ? 'Medium' : 'Low' }));
}

function asStudent(row: StudentRow): Student {
  const demo = demoStudents.find((item) => item.id === row.external_student_id);
  const risk = row.risk_level ?? demo?.risk ?? 'LOW';
  const attendance = Number(row.attendance ?? demo?.lmsActivity ?? 0);
  const score = Number(row.previous_scores ?? demo?.assessmentScore ?? 0);
  const probability = row.risk_probability == null ? demo?.riskScore ?? 0 : Number(row.risk_probability) * 100;
  return {
    ...(demo ?? {}), id: row.external_student_id, course: row.course ?? demo?.course ?? 'Unassigned', module: row.module ?? demo?.module ?? '—',
    risk, riskScore: Math.round(probability), engagement: attendance, lmsActivity: attendance, assessmentScore: score,
    lmsActivityChange: demo?.lmsActivityChange ?? 0, activeDaysChange: demo?.activeDaysChange ?? 0, assessmentSubmissionChange: demo?.assessmentSubmissionChange ?? 0, assessmentScoreChange: demo?.assessmentScoreChange ?? 0,
    weeklyEngagement: demo?.weeklyEngagement ?? Array(8).fill(attendance), lmsClicks: demo?.lmsClicks ?? Math.round(attendance * 2.5), activeDays: demo?.activeDays ?? Math.max(0, Math.round(attendance / 4)),
    assessmentsSubmitted: demo?.assessmentsSubmitted ?? Math.max(0, Math.round(score / 18)), studyCredits: demo?.studyCredits ?? 0, previousAttempts: demo?.previousAttempts ?? 0,
    educationLevel: row.education_level ?? demo?.educationLevel ?? 'Not recorded', observedWeeks: demo?.observedWeeks ?? 0, trendDirection: demo?.trendDirection ?? 'steady',
    lastUpdated: new Date(row.updated_at).toLocaleDateString(), factors: demo?.factors ?? factorsFor(risk),
    supportSuggestion: demo?.supportSuggestion ?? 'Review the available context with the student before deciding whether support would be useful.',
  };
}

export function useStudents() {
  const [rows, setRows] = useState<Student[]>(demoStudents);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(isSupabaseConfigured ? null : supabaseSetupMessage);
  const [source, setSource] = useState<'demo' | 'supabase'>('demo');
  useEffect(() => {
    let active = true;
    async function load() {
      if (!supabase) { setLoading(false); return; }
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { if (active) { setLoading(false); setError('Supabase is configured, but no Supabase user is signed in. Showing local synthetic demo data.'); } return; }
      const { data, error: queryError } = await supabase.from('students').select('*').order('external_student_id');
      if (!active) return;
      if (queryError) { setLoading(false); setError(`Could not load Supabase students: ${queryError.message}`); return; }
      setRows((data as StudentRow[]).map(asStudent)); setSource('supabase'); setError(null); setLoading(false);
    }
    load(); return () => { active = false; };
  }, []);
  return { students: rows, loading, error, source };
}

export async function getPredictionHistory(externalStudentId: string): Promise<PredictionHistory[]> {
  if (!supabase) return [];
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];
  const { data: student, error: studentError } = await supabase.from('students').select('id').eq('external_student_id', externalStudentId).single();
  if (studentError) throw studentError;
  const { data, error } = await supabase.from('risk_predictions').select('id,risk_level,probability,model_version,created_at').eq('student_id', student.id).order('created_at', { ascending: false });
  if (error) throw error;
  return data as PredictionHistory[];
}

export async function savePrediction(externalStudentId: string, risk: RiskLevel, probability: number, inputFeatures: Record<string, unknown>) {
  if (!supabase) return { saved: false, reason: 'Supabase is not configured.' };
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { saved: false, reason: 'Sign in with Supabase Auth before saving predictions.' };
  const { data: student, error: studentError } = await supabase.from('students').select('id').eq('external_student_id', externalStudentId).single();
  if (studentError) throw studentError;
  const { error: predictionError } = await supabase.from('risk_predictions').insert({ student_id: student.id, risk_level: risk, probability, model_version: 'Random Forest', input_features: inputFeatures });
  if (predictionError) throw predictionError;
  const { error: updateError } = await supabase.from('students').update({ risk_level: risk, risk_probability: probability }).eq('id', student.id);
  if (updateError) throw updateError;
  return { saved: true };
}
