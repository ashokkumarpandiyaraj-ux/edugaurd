import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Activity,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Info,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';

import { engagementTrend } from '../data';
import { getPredictionHistory, savePrediction, useStudents, type PredictionHistory } from '../lib/students';
import { EngagementChart } from '../components/charts';
import {
  Disclaimer,
  PageHeading,
  Panel,
  RiskBadge,
  SectionHeader,
} from '../components/ui';
import { formatChange } from '../utils';
import type { Student } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

type Risk = 'LOW' | 'MEDIUM' | 'HIGH';

type PredictionResponse = {
  risk: Risk;
  probability: number;
};

function DetailMetric({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: number;
  icon: typeof Activity;
}) {
  return (
    <div className="detail-metric">
      <span className="detail-metric-icon">
        <Icon size={16} />
      </span>

      <div>
        <span className="detail-metric-label">{label}</span>

        <strong>{value}</strong>

        <span
          className={`detail-change ${
            change < 0 ? 'down' : 'up'
          }`}
        >
          {change < 0 ? (
            <ArrowDownRight size={13} />
          ) : (
            <ArrowUpRight size={13} />
          )}

          {formatChange(change)} over recent weeks
        </span>
      </div>
    </div>
  );
}

function ProfileContent({ student }: { student: Student }) {
  const navigate = useNavigate();

  const [analysisState, setAnalysisState] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >('idle');

  const [prediction, setPrediction] =
    useState<PredictionResponse | null>(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [history, setHistory] = useState<PredictionHistory[]>([]);

  useEffect(() => { getPredictionHistory(student.id).then(setHistory).catch(() => setHistory([])); }, [student.id]);

  const trendData = useMemo(
    () =>
      student.weeklyEngagement.map((engagement, index) => ({
        week: `Week ${index + 1}`,
        engagement,
        reference:
          engagementTrend[index]?.reference ?? 78,
      })),
    [student.weeklyEngagement]
  );

  // ============================================================
  // CALL EDU GUARD ML MODEL
  // ============================================================

  async function analyzeStudent() {
    setAnalysisState('loading');
    setPrediction(null);
    setErrorMessage('');
    setSaveMessage('');

    /*
     * The current demo Student type contains LMS-style fields.
     *
     * The new ML model expects the fields from the uploaded
     * student-performance dataset.
     *
     * These mappings connect the existing demo profile to
     * the new model so the complete demo works immediately.
     */

    const payload = {
      Hours_Studied: Math.max(
        1,
        Math.min(
          20,
          Math.round(student.lmsActivity / 10)
        )
      ),

      Attendance: Math.max(
        0,
        Math.min(100, student.lmsActivity)
      ),

      Parental_Involvement: 'Medium',

      Access_to_Resources: 'Medium',

      Extracurricular_Activities: 'No',

      Sleep_Hours: 7,

      Previous_Scores: Math.max(
        0,
        Math.min(100, student.assessmentScore)
      ),

      Motivation_Level:
        student.lmsActivity < 50
          ? 'Low'
          : 'Medium',

      Internet_Access: 'Yes',

      Tutoring_Sessions:
        student.assessmentsSubmitted > 5
          ? 1
          : 0,

      Family_Income: 'Medium',

      Teacher_Quality: 'Medium',

      School_Type: 'Public',

      Peer_Influence:
        student.lmsActivity < 50
          ? 'Negative'
          : 'Neutral',

      Physical_Activity: 3,

      Learning_Disabilities: 'No',

      Parental_Education_Level:
        student.educationLevel || 'High School',

      Distance_from_Home: 'Moderate',

      Gender: 'Male',
    };

    try {
      const response = await fetch(
        `${API_URL}/predict`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },

          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error =
          await response.json().catch(() => null);

        throw new Error(
          error?.detail ||
            `Prediction failed with status ${response.status}`
        );
      }

      const result: PredictionResponse =
        await response.json();

      console.log(
        'EduGuard ML prediction:',
        result
      );

      setPrediction(result);
      setAnalysisState('ready');
      try {
        const save = await savePrediction(student.id, result.risk, result.probability, payload);
        if (save.saved) {
          setSaveMessage('Prediction saved to Supabase.');
          setHistory(await getPredictionHistory(student.id));
        } else {
          setSaveMessage(save.reason);
        }
      } catch (saveError) {
        setSaveMessage(`Prediction was not saved: ${saveError instanceof Error ? saveError.message : 'database request failed.'}`);
      }
    } catch (error) {
      console.error(
        'EduGuard prediction error:',
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to connect to the prediction API.'
      );

      setAnalysisState('error');
    }
  }

  // ============================================================
  // DISPLAY VALUES
  // ============================================================

  const displayedRisk: Risk =
    prediction?.risk ??
    (student.risk as Risk);

  const displayedProbability =
    prediction?.probability != null
      ? Math.round(
          prediction.probability * 100
        )
      : student.riskScore;

  return (
    <div className="page-stack page-enter student-profile-page">

      {/* ======================================================
          BACK BUTTON
      ====================================================== */}

      <button
        className="back-link"
        onClick={() => navigate('/students')}
      >
        <ArrowLeft size={15} />
        Back to students
      </button>


      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <PageHeading
        eyebrow="STUDENT PROFILE · EARLY WARNING ANALYSIS"
        title={student.id}
        description={`${student.course} · ${student.module} · Student performance profile`}
        actions={
          <button
            className="button button-primary"
            onClick={analyzeStudent}
            disabled={
              analysisState === 'loading'
            }
          >
            {analysisState === 'loading' ? (
              <>
                <LoaderCircle
                  size={16}
                  className="spin"
                />

                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={16} />

                {prediction
                  ? 'Run Analysis Again'
                  : 'Analyze Student'}
              </>
            )}
          </button>
        }
      />


      {/* ======================================================
          SAFETY / STATUS
      ====================================================== */}

      <div className="profile-safety-note">

        <Info size={15} />

        <span>
          AI early-warning signal for faculty
          review. It does not make an academic
          decision.
        </span>

        {prediction ? (
          <span className="demo-stamp">
            LIVE ML MODEL
          </span>
        ) : (
          <span className="demo-stamp">
            READY FOR ANALYSIS
          </span>
        )}

      </div>


      {/* ======================================================
          RISK + ACADEMIC CONTEXT
      ====================================================== */}

      <div className="profile-top-grid">

        {/* RISK CARD */}

        <Panel className="profile-overview">

          <div className="profile-risk-head">

            <div>

              <span className="eyebrow">
                CURRENT EARLY-RISK SIGNAL
              </span>

              <div className="profile-risk-title">

                <RiskBadge
                  risk={displayedRisk}
                  label={`${displayedRisk} RISK`}
                />

                <span className="risk-score-label">
                  {prediction
                    ? 'ML model probability'
                    : 'Current demo signal'}
                </span>

              </div>

            </div>

            <span className="risk-score-large">

              {displayedProbability}

              <small>%</small>

            </span>

          </div>


          <div className="risk-meter">

            <span
              className={`risk-meter-fill ${displayedRisk.toLowerCase()}`}
              style={{
                width: `${displayedProbability}%`,
              }}
            />

          </div>


          <div className="score-scale">

            <span>
              {prediction
                ? 'Random Forest model result'
                : 'Run analysis to generate ML prediction'}
            </span>

            <span>
              Updated {student.lastUpdated}
            </span>

          </div>


          <div className="profile-facts">

            <span>
              <BookOpen size={14} />

              {student.module}
            </span>

            <span>
              <CalendarDays size={14} />

              {student.observedWeeks} weeks observed
            </span>

          </div>

        </Panel>


        {/* ACADEMIC CONTEXT */}

        <Panel className="profile-context">

          <SectionHeader
            title="Academic context"
            subtitle="Details to support a contextual faculty review"
          />

          <div className="context-grid">

            <div>

              <span>
                Course / module
              </span>

              <strong>

                {student.course}

                <small>
                  {student.module}
                </small>

              </strong>

            </div>


            <div>

              <span>
                Study credits
              </span>

              <strong>
                {student.studyCredits}
              </strong>

            </div>


            <div>

              <span>
                Previous attempts
              </span>

              <strong>
                {student.previousAttempts}
              </strong>

            </div>


            <div>

              <span>
                Education level
              </span>

              <strong>
                {student.educationLevel}
              </strong>

            </div>

          </div>

        </Panel>

      </div>


      {/* ======================================================
          METRICS
      ====================================================== */}

      <div className="detail-metrics-grid">

        <DetailMetric
          label="LMS activity"
          value={`${student.lmsActivity}%`}
          change={
            student.lmsActivityChange
          }
          icon={Activity}
        />

        <DetailMetric
          label="Active learning days"
          value={`${student.activeDays} days`}
          change={
            student.activeDaysChange
          }
          icon={CalendarDays}
        />

        <DetailMetric
          label="Assessment submission"
          value={`${student.assessmentsSubmitted} submitted`}
          change={
            student.assessmentSubmissionChange
          }
          icon={CheckCircle2}
        />

        <DetailMetric
          label="Assessment score"
          value={`${student.assessmentScore}%`}
          change={
            student.assessmentScoreChange
          }
          icon={GraduationCap}
        />

      </div>


      {/* ======================================================
          ENGAGEMENT CHART
      ====================================================== */}

      <Panel className="chart-panel profile-trend-panel">

        <SectionHeader
          title="Student Engagement Trend"
          subtitle="Weekly engagement during the observation window"
          action={
            <span className="chart-window">

              <Clock3 size={13} />

              Week 1–8

            </span>
          }
        />

        <EngagementChart
          data={trendData}
          height={250}
          currentLabel="Student engagement"
          referenceLabel="Reference trend"
        />

      </Panel>


      {/* ======================================================
          EXPLANATION + SUPPORT
      ====================================================== */}

      <div className="explanation-grid">

        {/* FACTORS */}

        <Panel className="explanation-panel">

          <SectionHeader
            title="Why Was This Student Flagged?"
            subtitle={
              prediction
                ? 'Factors displayed for faculty context'
                : 'Run the model to generate the risk signal'
            }
            action={
              <span className="model-based-tag">

                <ShieldCheck size={13} />

                Random Forest

              </span>
            }
          />


          <div className="factors-list">

            {student.factors.map(
              (factor, index) => (

                <div
                  className="factor-row"
                  key={factor.label}
                >

                  <span className="factor-rank">
                    0{index + 1}
                  </span>


                  <div className="factor-main">

                    <div className="factor-label-row">

                      <strong>
                        {factor.label}
                      </strong>

                      <span
                        className={`factor-strength strength-${factor.strength.toLowerCase()}`}
                      >
                        {factor.strength}
                        {' '}
                        contribution
                      </span>

                    </div>


                    <div className="factor-bar">

                      <span
                        style={{
                          width: `${factor.contribution}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

              )
            )}

          </div>


          <div className="model-explanation-note">

            <Info size={14} />

            <span>
              The risk classification is generated
              by the connected Random Forest model.
              The factor bars shown here are
              contextual indicators and are not
              SHAP values.
            </span>

          </div>

        </Panel>


        {/* SUPPORT */}

        <Panel className="support-panel">

          <SectionHeader
            title="AI Support Suggestion"
            subtitle="A supportive starting point for a faculty conversation"
            action={
              <span className="suggestion-tag">

                <Sparkles size={13} />

                Supportive suggestion

              </span>
            }
          />


          <p className="suggestion-copy">

            {student.id === 'STU-1023'
              ? 'The student has shown a sustained decline in LMS activity and assessment participation. Consider a mentor check-in to understand the reason for the change and provide academic support where appropriate.'
              : student.supportSuggestion}

          </p>


          <div className="support-action-list">

            {[
              'Mentor check-in',
              'Assignment support',
              'Academic guidance',
              'Monitor engagement over the next 1–2 weeks',
            ].map((action) => (

              <span key={action}>

                <CheckCircle2 size={14} />

                {action}

              </span>

            ))}

          </div>


          <Disclaimer>
            AI suggestions are supportive
            recommendations. Faculty members make
            the final decision.
          </Disclaimer>

        </Panel>

      </div>


      {/* ======================================================
          LOADING RESULT
      ====================================================== */}

      {analysisState === 'loading' && (

        <Panel className="analysis-result">

          <div className="analysis-result-icon">

            <LoaderCircle
              size={18}
              className="spin"
            />

          </div>


          <div className="analysis-result-body">

            <span className="eyebrow">
              ANALYZING STUDENT
            </span>

            <h3>
              Running EduGuard Random Forest model...
            </h3>

            <p>
              Sending the student profile to the
              FastAPI prediction service.
            </p>

          </div>

        </Panel>

      )}


      {/* ======================================================
          SUCCESS RESULT
      ====================================================== */}

      {analysisState === 'ready' &&
        prediction && (

          <Panel className="analysis-result">

            <div className="analysis-result-icon">

              <Sparkles size={18} />

            </div>


            <div className="analysis-result-body">

              <span className="eyebrow">
                LIVE ML ANALYSIS COMPLETE
              </span>


              <h3>

                {prediction.risk}

                {' '}early-risk signal ·{' '}

                {Math.round(
                  prediction.probability * 100
                )}

                % probability

              </h3>


              <p>

                The connected Random Forest model
                classified this student profile as{' '}

                <strong>
                  {prediction.risk}
                </strong>

                {' '}risk.

              </p>


              <strong>
                Faculty review remains required
                before taking any action.
              </strong>

            </div>


            <button
              className="icon-button"
              aria-label="Dismiss analysis result"
              onClick={() => {
                setAnalysisState('idle');
                setPrediction(null);
              }}
            >
              ×
            </button>

          </Panel>

        )}


      {/* ======================================================
          ERROR RESULT
      ====================================================== */}

      {analysisState === 'error' && (

        <Panel className="analysis-result">

          <div className="analysis-result-icon">

            <Info size={18} />

          </div>


          <div className="analysis-result-body">

            <span className="eyebrow">
              MODEL CONNECTION ERROR
            </span>


            <h3>
              Could not complete the analysis
            </h3>


            <p>
              {errorMessage}
            </p>


            <strong>
              Make sure FastAPI is running on
              port 8000.
            </strong>

          </div>


          <button
            className="icon-button"
            aria-label="Dismiss error"
            onClick={() => {
              setAnalysisState('idle');
              setErrorMessage('');
            }}
          >
            ×
          </button>

        </Panel>

      )}


      {/* ======================================================
          FOOTER
      ====================================================== */}

      <div className="decision-footer">

        <UsersRound size={15} />

        <span>
          Faculty review recommended where
          appropriate. This early-warning prototype
          never makes an academic decision or
          initiates contact.
        </span>

      </div>

    </div>
  );
}


// ============================================================
// PAGE
// ============================================================

export function StudentDetailPage() {

  const { id = '' } = useParams();
  const { students, loading, error } = useStudents();
  const student = students.find((item) => item.id.toUpperCase() === id.toUpperCase());

  if (loading) return <Panel className="not-found"><p>Loading student record…</p></Panel>;


  if (!student) {

    return (

      <Panel className="not-found">

        <span className="eyebrow">
          No demo record
        </span>


        <h2>
          That student is not in the sample.
        </h2>


        <p>
          Search the representative sample for
          an available student profile.
        </p>
        {error && <p>{error}</p>}


        <button
          className="button button-primary"
          onClick={() =>
            window.location.assign('/students')
          }
        >
          Back to students
        </button>

      </Panel>

    );

  }


  return (
    <ProfileContent student={student} />
  );
}
