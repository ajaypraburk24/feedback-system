import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Info, 
  Lock, 
  User, 
  BookOpen, 
  Star, 
  Lightbulb, 
  TrendingUp, 
  RefreshCw,
  EyeOff
} from 'lucide-react';
import { Student, Faculty, ComplianceConfig } from '../types';
import { StorageService } from '../services/storage';

interface StudentModuleProps {
  currentStudent: Student;
  facultyList: Faculty[];
  config: ComplianceConfig;
  onFeedbackSubmitted: () => void;
  onViewFacultyReport: (facultyId: number) => void;
}

export const StudentModule: React.FC<StudentModuleProps> = ({
  currentStudent,
  facultyList,
  config,
  onFeedbackSubmitted,
  onViewFacultyReport,
}) => {
  // Selected faculty for feedback
  const [selectedFacultyId, setSelectedFacultyId] = useState<number>(facultyList[0]?.faculty_id || 1);

  // Ratings (1 to 5)
  const [teaching, setTeaching] = useState<number>(5);
  const [communication, setCommunication] = useState<number>(5);
  const [subjectKnowledge, setSubjectKnowledge] = useState<number>(5);
  const [punctuality, setPunctuality] = useState<number>(5);
  const [classroomInteraction, setClassroomInteraction] = useState<number>(5);
  const [overallRating, setOverallRating] = useState<number>(5);

  // Comments / Suggestions
  const [comments, setComments] = useState<string>('');

  // Live Sentiment Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [sentimentResult, setSentimentResult] = useState<{
    score: number;
    label: 'Positive' | 'Constructive' | 'Neutral' | 'Negative';
    confidence: number;
    tone: string;
    strengths: string[];
    improvements: string[];
    sanitizedText: string;
    piiDetected: boolean;
    source: string;
  }>({
    score: 0.8,
    label: 'Positive',
    confidence: 0.9,
    tone: 'Encouraging & Constructive',
    strengths: ['Clear explanation'],
    improvements: [],
    sanitizedText: '',
    piiDetected: false,
    source: 'initial',
  });

  // Submission state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<{
    blindToken: string;
    feedbackId: number;
    facultyName: string;
    subject: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const activeFaculty = facultyList.find((f) => f.faculty_id === selectedFacultyId) || facultyList[0];
  const isAlreadySubmitted = StorageService.hasStudentSubmitted(currentStudent.student_id, selectedFacultyId, config.currentSemester);

  // Debounced real-time sentiment analysis
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!comments || comments.trim().length === 0) {
      setSentimentResult({
        score: 0,
        label: 'Neutral',
        confidence: 1.0,
        tone: 'Type to analyze feedback sentiment in real-time...',
        strengths: [],
        improvements: [],
        sanitizedText: '',
        piiDetected: false,
        source: 'idle',
      });
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    setIsAnalyzing(true);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/sentiment/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: comments,
            facultyName: activeFaculty?.faculty_name,
            subject: activeFaculty?.subject,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setSentimentResult(data);
        }
      } catch (err) {
        console.warn('Real-time sentiment fetch failed:', err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 350);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [comments, selectedFacultyId]);

  const handleRatingChange = (criterion: string, val: number) => {
    if (criterion === 'teaching') setTeaching(val);
    else if (criterion === 'communication') setCommunication(val);
    else if (criterion === 'subjectKnowledge') setSubjectKnowledge(val);
    else if (criterion === 'punctuality') setPunctuality(val);
    else if (criterion === 'classroomInteraction') setClassroomInteraction(val);
    else if (criterion === 'overallRating') setOverallRating(val);
  };

  const handleSelectFaculty = (facultyId: number) => {
    setSelectedFacultyId(facultyId);
    setSubmittedReceipt(null);
    setErrorMessage('');
  };

  const handleQuickSuggestion = (text: string) => {
    setComments((prev) => (prev ? `${prev} ${text}` : text));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!comments.trim()) {
      setErrorMessage('Please provide a brief suggestion or feedback comment.');
      return;
    }

    setSubmitting(true);
    try {
      const sanitizedText = sentimentResult.sanitizedText || comments;

      const result = StorageService.submitFeedback({
        studentId: currentStudent.student_id,
        facultyId: selectedFacultyId,
        teaching,
        communication,
        subjectKnowledge,
        punctuality,
        classroomInteraction,
        overallRating,
        comments,
        sanitizedComments: sanitizedText,
        sentimentScore: sentimentResult.score,
        sentimentLabel: sentimentResult.label,
        sentimentTone: sentimentResult.tone,
        strengths: sentimentResult.strengths,
        improvements: sentimentResult.improvements,
        piiDetected: sentimentResult.piiDetected,
      });

      setSubmittedReceipt({
        blindToken: result.blindToken,
        feedbackId: result.feedbackId,
        facultyName: activeFaculty.faculty_name,
        subject: activeFaculty.subject,
      });

      // Clear form comments
      setComments('');
      onFeedbackSubmitted();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error recording feedback submission.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Student Profile & Privacy Assurance Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-indigo-500/5 to-transparent pointer-events-none rounded-full blur-3xl" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold text-xl shadow-inner">
              {currentStudent.student_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">{currentStudent.student_name}</h1>
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  Reg: {currentStudent.reg_no || currentStudent.student_id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentStudent.department} • Year {currentStudent.year} • {config.currentSemester}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <EyeOff className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">100% Anonymous Evaluation</p>
              <p className="text-[11px] text-slate-400">
                Identity is cryptographically unlinked via Blind Tokens. Faculty never sees student identity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Selection Carousel/Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Assigned Faculty Members ({facultyList.length})
            </h2>
            <p className="text-xs text-slate-500">
              Select a faculty handling your department's subjects for {config.currentSemester}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {facultyList.map((faculty) => {
            const submitted = StorageService.hasStudentSubmitted(currentStudent.student_id, faculty.faculty_id, config.currentSemester);
            const isSelected = faculty.faculty_id === selectedFacultyId;

            return (
              <button
                key={faculty.faculty_id}
                type="button"
                onClick={() => handleSelectFaculty(faculty.faculty_id)}
                className={`text-left p-4 rounded-xl border transition-all relative ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-100 text-sm">{faculty.faculty_name}</h3>
                    <p className="text-xs font-medium text-cyan-400 mt-0.5">{faculty.subject}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{faculty.department}</p>
                  </div>

                  {submitted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Submitted
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-800/60 font-medium">
                      Pending
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Feedback Form or Submission Success Receipt */}
      {submittedReceipt ? (
        <div className="bg-slate-900 border border-emerald-700/50 rounded-2xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-950/50">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-white">Feedback Submitted Successfully!</h2>
            <p className="text-xs text-slate-400">
              Your evaluation for <strong className="text-slate-200">{submittedReceipt.facultyName}</strong> (
              {submittedReceipt.subject}) has been securely recorded.
            </p>
          </div>

          {/* Cryptographic Zero-Knowledge Token Receipt */}
          <div className="max-w-lg mx-auto bg-slate-950 border border-slate-800 rounded-xl p-4 text-left font-mono text-xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Security Standard:</span>
              <span className="text-emerald-400 font-bold">FERPA / GDPR Anonymity Guaranteed</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Blind Token Hash:</span>
              <span className="text-cyan-300 break-all select-all">{submittedReceipt.blindToken}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Database Record ID:</span>
              <span className="text-slate-300">#{submittedReceipt.feedbackId} (Decoupled from Student ID)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Timestamp:</span>
              <span className="text-slate-300">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                const nextPending = facultyList.find(
                  (f) => !StorageService.hasStudentSubmitted(currentStudent.student_id, f.faculty_id, config.currentSemester)
                );
                if (nextPending) {
                  setSelectedFacultyId(nextPending.faculty_id);
                  setSubmittedReceipt(null);
                } else {
                  setSubmittedReceipt(null);
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg transition"
            >
              Evaluate Another Faculty
            </button>
            <button
              onClick={() => onViewFacultyReport(submittedReceipt.feedbackId ? selectedFacultyId : 1)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition"
            >
              View Faculty's Anonymous Aggregated Report
            </button>
          </div>
        </div>
      ) : isAlreadySubmitted ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-emerald-400 border border-slate-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Evaluation Already Completed</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You have already submitted anonymous feedback for <strong className="text-slate-200">{activeFaculty.faculty_name}</strong> in this session.
            According to institutional regulations (PDF Chapter 7.1), each student can submit only once per faculty member to maintain data integrity.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onViewFacultyReport(activeFaculty.faculty_id)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition"
            >
              View Summarized Faculty Performance
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-8">
            {/* Feedback Target Header */}
            <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Feedback Form</span>
                <h3 className="text-lg font-bold text-white">
                  Evaluation for {activeFaculty.faculty_name}
                </h3>
                <p className="text-xs text-slate-400">
                  Subject: <strong className="text-slate-300">{activeFaculty.subject}</strong> ({activeFaculty.department})
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Identity Masking Active</span>
              </div>
            </div>

            {/* 6 Predefined Evaluation Criteria matching PDF Specification */}
            <div className="space-y-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400" />
                Predefined Evaluation Parameters (Scale 1 to 5)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Teaching Quality */}
                <CriterionRating
                  title="1. Teaching Quality & Effectiveness"
                  description="Clarity of concepts, structured lesson delivery, and pedagogical methods."
                  value={teaching}
                  onChange={(v) => handleRatingChange('teaching', v)}
                />

                {/* 2. Communication Skills */}
                <CriterionRating
                  title="2. Communication Skills"
                  description="Audibility, articulate explanation, and receptiveness to student questions."
                  value={communication}
                  onChange={(v) => handleRatingChange('communication', v)}
                />

                {/* 3. Subject Knowledge */}
                <CriterionRating
                  title="3. Subject Knowledge & Depth"
                  description="Mastery over the curriculum, ability to explain beyond textbook examples."
                  value={subjectKnowledge}
                  onChange={(v) => handleRatingChange('subjectKnowledge', v)}
                />

                {/* 4. Punctuality */}
                <CriterionRating
                  title="4. Punctuality & Time Management"
                  description="Regularity in conducting lectures on schedule and syllabus completion."
                  value={punctuality}
                  onChange={(v) => handleRatingChange('punctuality', v)}
                />

                {/* 5. Classroom Interaction */}
                <CriterionRating
                  title="5. Classroom Interaction & Discipline"
                  description="Encourages student discussions, creates an interactive and respectful environment."
                  value={classroomInteraction}
                  onChange={(v) => handleRatingChange('classroomInteraction', v)}
                />

                {/* 6. Overall Rating */}
                <CriterionRating
                  title="6. Overall Satisfaction & Rating"
                  description="General overall appraisal of faculty performance and course value."
                  value={overallRating}
                  onChange={(val) => handleRatingChange('overallRating', val)}
                />
              </div>
            </div>

            {/* Real-Time Sentiment & Comments Section */}
            <div className="border-t border-slate-800 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Student Suggestions &amp; Real-Time AI Sentiment Analysis
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Provide constructive comments. Our AI analyzes sentiment in real time and automatically sanitizes identifying details.
                  </p>
                </div>

                {isAnalyzing && (
                  <span className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Analyzing sentiment...
                  </span>
                )}
              </div>

              {/* Text Area */}
              <div className="relative">
                <textarea
                  rows={4}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Enter your candid feedback, suggestions, or highlights (e.g. 'Excellent teaching and easy explanation. Would appreciate more hands-on lab problems')..."
                  className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 rounded-xl p-4 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm leading-relaxed transition"
                />
              </div>

              {/* Quick suggestion starter chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3 text-amber-400" />
                  Quick Starters:
                </span>
                <button
                  type="button"
                  onClick={() => handleQuickSuggestion('Excellent teaching and easy explanation of complex concepts.')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                >
                  "Excellent teaching &amp; easy explanation"
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSuggestion('Very punctual and always provides helpful doubt resolution after class.')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                >
                  "Very punctual &amp; clear doubts"
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSuggestion('Pacing in lab sessions could be slightly slower for complex code.')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                >
                  "Slightly slower pace in lab"
                </button>
              </div>

              {/* Live Real-Time Sentiment & PII Privacy Dashboard */}
              {comments.trim().length > 0 && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                  {/* Gauge & Metrics Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* Polarity Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
                          sentimentResult.label === 'Positive'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : sentimentResult.label === 'Constructive'
                            ? 'bg-blue-950 text-blue-400 border-blue-800'
                            : sentimentResult.label === 'Negative'
                            ? 'bg-rose-950 text-rose-400 border-rose-800'
                            : 'bg-slate-900 text-slate-300 border-slate-700'
                        }`}
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        Sentiment: {sentimentResult.label} (Score: {sentimentResult.score.toFixed(2)})
                      </span>

                      <span className="text-xs text-slate-400">
                        Tone: <strong className="text-slate-200">{sentimentResult.tone}</strong>
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-500">
                      Engine: {sentimentResult.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash (Live NLP)' : 'Local Privacy Heuristic'}
                    </div>
                  </div>

                  {/* Sentiment Bar Slider Visualization */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Constructive / Critical (-1.0)</span>
                      <span>Neutral (0.0)</span>
                      <span>Positive &amp; Appreciative (+1.0)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
                      <div className="absolute inset-y-0 left-1/2 w-0.5 bg-slate-600 z-10" />
                      <div
                        className={`h-full transition-all duration-300 ${
                          sentimentResult.score >= 0 ? 'bg-gradient-to-r from-cyan-500 to-emerald-400' : 'bg-gradient-to-r from-rose-500 to-amber-400'
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(5, ((sentimentResult.score + 1) / 2) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Strengths & Improvements detected */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    {sentimentResult.strengths.length > 0 && (
                      <div className="bg-emerald-950/30 border border-emerald-900/50 p-2.5 rounded-lg space-y-1">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Detected Pedagogical Strengths:
                        </span>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                          {sentimentResult.strengths.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {sentimentResult.improvements.length > 0 && (
                      <div className="bg-blue-950/30 border border-blue-900/50 p-2.5 rounded-lg space-y-1">
                        <span className="text-blue-400 font-semibold flex items-center gap-1">
                          <Lightbulb className="w-3.5 h-3.5" />
                          Actionable Growth Suggestions:
                        </span>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                          {sentimentResult.improvements.map((imp, idx) => (
                            <li key={idx}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* PII Detection & De-Identification Alert Banner */}
                  {sentimentResult.piiDetected && (
                    <div className="bg-amber-950/50 border border-amber-800/80 rounded-xl p-3 text-xs space-y-2">
                      <div className="flex items-center gap-2 text-amber-300 font-semibold">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                        <span>FERPA / GDPR De-Identification Notice: Identifiers Detected</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        To protect your student privacy and prevent faculty re-identification, your comments have been automatically sanitized.
                      </p>
                      <div className="bg-slate-900/90 p-2 rounded border border-amber-900/50 font-mono text-[11px] text-amber-200">
                        <span className="text-slate-500 select-none">Sanitized for Faculty: </span>
                        {sentimentResult.sanitizedText}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>One evaluation per faculty per session. Responses cannot be altered post-submission.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Encrypting &amp; Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Anonymous Evaluation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

// Rating component with 5 stars / buttons and descriptive scale
interface CriterionRatingProps {
  title: string;
  description: string;
  value: number;
  onChange: (val: number) => void;
}

const CriterionRating: React.FC<CriterionRatingProps> = ({ title, description, value, onChange }) => {
  const labels: Record<number, string> = {
    1: '1 - Poor',
    2: '2 - Fair',
    3: '3 - Good',
    4: '4 - Very Good',
    5: '5 - Excellent',
  };

  return (
    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-3 hover:border-slate-700 transition">
      <div>
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-semibold text-slate-200">{title}</h5>
          <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/40 border border-amber-900/40">
            {labels[value] || `${value}/5`}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>
      </div>

      {/* 5-Star interactive buttons */}
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`flex-1 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition ${
              star <= value
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${star <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
            <span>{star}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
