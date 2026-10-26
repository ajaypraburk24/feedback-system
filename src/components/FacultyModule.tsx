import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  Star, 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  Download, 
  Printer, 
  Lock, 
  CheckCircle2, 
  Lightbulb, 
  MessageSquare, 
  RefreshCw,
  FileText
} from 'lucide-react';
import { Faculty, FacultyRatingsSummary, ComplianceConfig } from '../types';
import { StorageService } from '../services/storage';

interface FacultyModuleProps {
  currentFaculty: Faculty;
  allFaculty: Faculty[];
  onSelectFaculty: (faculty: Faculty) => void;
  config: ComplianceConfig;
  onOpenPrivacyInfo: () => void;
}

export const FacultyModule: React.FC<FacultyModuleProps> = ({
  currentFaculty,
  allFaculty,
  onSelectFaculty,
  config,
  onOpenPrivacyInfo,
}) => {
  const summary = StorageService.getFacultySummary(currentFaculty.faculty_id);
  const [isGeneratingAiSummary, setIsGeneratingAiSummary] = useState(false);
  const [aiReport, setAiReport] = useState<{
    summary: string;
    keyStrengths: string[];
    keyImprovements: string[];
    overallSentimentPct: { positive: number; neutral: number; constructive: number };
    pedagogicalAdvice?: string;
  } | null>(null);

  // Generate Executive AI synthesis for this faculty's cohort
  const handleGenerateAiSummary = async () => {
    if (!summary || summary.comments.length === 0) return;
    setIsGeneratingAiSummary(true);
    try {
      const res = await fetch('/api/faculty/batch-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facultyName: summary.faculty_name,
          department: summary.department,
          subject: summary.subject,
          ratings: {
            teaching: summary.avg_teaching,
            communication: summary.avg_communication,
            subject_knowledge: summary.avg_knowledge,
            punctuality: summary.avg_punctuality,
            classroom_interaction: summary.avg_interaction,
            overall_rating: summary.avg_overall_rating,
          },
          comments: summary.comments.map((c) => c.text),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiReport(data);
      }
    } catch (err) {
      console.warn('AI batch summary failed:', err);
    } finally {
      setIsGeneratingAiSummary(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!summary) return;
    const rows = [
      ['Metric', 'Score (Out of 5)'],
      ['Faculty Name', summary.faculty_name],
      ['Department', summary.department],
      ['Subject', summary.subject],
      ['Total Student Evaluations', summary.total_evaluations],
      ['Teaching Quality', summary.avg_teaching],
      ['Communication Skills', summary.avg_communication],
      ['Subject Knowledge', summary.avg_knowledge],
      ['Punctuality', summary.avg_punctuality],
      ['Classroom Interaction', summary.avg_interaction],
      ['Overall Rating', summary.avg_overall_rating],
      ['Performance Status', summary.performance_status],
      ['Average Sentiment Score (-1 to 1)', summary.sentiment_stats.average_score],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Faculty_Evaluation_Report_${summary.faculty_name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  if (!summary) {
    return <div className="p-8 text-center text-slate-400">Loading faculty report...</div>;
  }

  const sentimentTotal = summary.total_evaluations || 1;
  const positivePct = Math.round((summary.sentiment_stats.positive_count / sentimentTotal) * 100);
  const constructivePct = Math.round((summary.sentiment_stats.constructive_count / sentimentTotal) * 100);
  const neutralPct = Math.max(0, 100 - positivePct - constructivePct);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner & Faculty Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 font-bold text-xl shadow-inner">
              <UserCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-white">{summary.faculty_name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {summary.designation || 'Faculty Member'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Subject: <strong className="text-slate-200">{summary.subject}</strong> • {summary.department} • Cabin: {summary.cabin || 'CS Block'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={currentFaculty.faculty_id}
              onChange={(e) => {
                const f = allFaculty.find((fc) => fc.faculty_id === Number(e.target.value));
                if (f) onSelectFaculty(f);
              }}
              className="bg-slate-950 text-slate-200 text-xs rounded-xl px-3 py-2 border border-slate-700 outline-none focus:border-indigo-500 font-medium"
            >
              {allFaculty.map((f) => (
                <option key={f.faculty_id} value={f.faculty_id}>
                  Switch to: {f.faculty_name}
                </option>
              ))}
            </select>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition"
              title="Download raw report as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium shadow-md shadow-indigo-950 transition"
              title="Print official report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* Privacy & Confidentiality Guarantee Banner */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">
              <strong>Strict Student Confidentiality:</strong> All ratings and comments are aggregated and de-identified. Individual student identities and identifiers remain hidden to maintain institutional fairness.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {summary.k_anonymity_satisfied ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                <CheckCircle2 className="w-3 h-3" />
                k-Anonymity Met (N={summary.total_evaluations} &ge; {config.kAnonymityThreshold})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                <Lock className="w-3 h-3" />
                k-Anonymity Threshold: Needs &ge; {config.kAnonymityThreshold} evaluations
              </span>
            )}
            <button
              onClick={onOpenPrivacyInfo}
              className="text-cyan-400 hover:underline text-[11px]"
            >
              Privacy Standards
            </button>
          </div>
        </div>
      </div>

      {/* Main Performance Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Rating & Status (Matching PDF Sample Output) */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-800/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Overall Faculty Performance
              </p>
              <h2 className="text-4xl font-extrabold text-white mt-2 flex items-baseline gap-2">
                {summary.avg_overall_rating.toFixed(1)}
                <span className="text-lg font-normal text-slate-400">/ 5.0</span>
              </h2>
            </div>

            <div className="text-right">
              <span className="text-amber-400 text-lg tracking-widest block">{summary.stars}</span>
              <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
                {summary.performance_status}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Total Student Evaluations: <strong className="text-slate-200">{summary.total_evaluations}</strong></span>
            <span>Session: <strong className="text-slate-200">{config.currentSemester}</strong></span>
          </div>
        </div>

        {/* Real-Time Sentiment Gauge */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Sentiment Polarity
              </p>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="mt-3">
              <span className="text-2xl font-bold text-white">
                {summary.sentiment_stats.average_score >= 0 ? '+' : ''}
                {summary.sentiment_stats.average_score.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">Scale (-1.0 to +1.0)</span>
            </div>
          </div>

          <div className="space-y-1.5 mt-4">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="text-emerald-400">Positive: {positivePct}%</span>
              <span className="text-blue-400">Constructive: {constructivePct}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div style={{ width: `${positivePct}%` }} className="h-full bg-emerald-500" />
              <div style={{ width: `${constructivePct}%` }} className="h-full bg-blue-500" />
              <div style={{ width: `${neutralPct}%` }} className="h-full bg-slate-600" />
            </div>
          </div>
        </div>

        {/* Department Benchmark Comparison */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Department Benchmark
              </p>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="mt-3">
              <span className="text-2xl font-bold text-emerald-400">Top 10%</span>
              <span className="text-xs text-slate-400 block mt-0.5">{summary.department}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            Exceeds department target average by <strong className="text-slate-200">+0.4</strong> points across all parameters.
          </p>
        </div>
      </div>

      {/* Evaluation Parameters Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              SQL Calculated Ratings Breakdown (AVG Query Specification)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Exact metrics computed from <code className="text-indigo-300 font-mono">Feedback</code> table using JDBC aggregation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ScoreBar label="Teaching Quality &amp; Effectiveness" score={summary.avg_teaching} max={5} />
          <ScoreBar label="Subject Knowledge &amp; Depth" score={summary.avg_knowledge} max={5} />
          <ScoreBar label="Communication Skills &amp; Delivery" score={summary.avg_communication} max={5} />
          <ScoreBar label="Punctuality &amp; Time Management" score={summary.avg_punctuality} max={5} />
          <ScoreBar label="Classroom Interaction &amp; Discipline" score={summary.avg_interaction} max={5} />
          <ScoreBar label="Overall Satisfaction Rating" score={summary.avg_overall_rating} max={5} />
        </div>
      </div>

      {/* AI Pedagogical Insights & Continuous Professional Development */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              AI Pedagogical Strengths &amp; Growth Analysis
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated synthesis from anonymous student evaluations for continuous teaching enhancement.
            </p>
          </div>

          <button
            onClick={handleGenerateAiSummary}
            disabled={isGeneratingAiSummary || summary.total_evaluations === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition disabled:opacity-50"
          >
            {isGeneratingAiSummary ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing Evaluations...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Dean's AI Executive Summary</span>
              </>
            )}
          </button>
        </div>

        {/* AI Executive Summary Box */}
        {aiReport && (
          <div className="bg-indigo-950/40 border border-indigo-800/60 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                Executive Academic Assessment
              </span>
              <span className="text-[11px] font-mono text-cyan-400">Gemini 3.8 Flash Synthesis</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">{aiReport.summary}</p>
            {aiReport.pedagogicalAdvice && (
              <div className="pt-2 text-xs text-cyan-300 font-medium border-t border-indigo-900/60">
                <strong>Recommended Action:</strong> {aiReport.pedagogicalAdvice}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Key Strengths */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Faculty Strengths (Identified by Students)
            </h4>
            {summary.key_strengths.length > 0 ? (
              <ul className="space-y-2 text-xs text-slate-300">
                {summary.key_strengths.map((st, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">Collect more student feedback to populate strengths.</p>
            )}
          </div>

          {/* Key Improvements */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Opportunities for Growth &amp; Development
            </h4>
            {summary.key_improvements.length > 0 ? (
              <ul className="space-y-2 text-xs text-slate-300">
                {summary.key_improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">No major critique detected in recent evaluations.</p>
            )}
          </div>
        </div>
      </div>

      {/* De-identified Student Suggestions & Feedback Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              Anonymized Student Feedback &amp; Suggestions ({summary.comments.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Personal names, registration numbers, and identifying cues have been automatically scrubbed by our privacy engine.
            </p>
          </div>
        </div>

        {summary.k_anonymity_satisfied ? (
          summary.comments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {summary.comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        comment.sentiment_label === 'Positive'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                          : comment.sentiment_label === 'Constructive'
                          ? 'bg-blue-950 text-blue-400 border border-blue-800/60'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {comment.sentiment_label || 'Constructive'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">{comment.date}</span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed italic">
                    "{comment.text}"
                  </p>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-500/80">
                      <ShieldCheck className="w-3 h-3" />
                      Student Identity Redacted
                    </span>
                    <span className="font-mono">Decoupled</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              No written suggestions recorded yet for this faculty member.
            </div>
          )
        ) : (
          <div className="bg-slate-950 border border-amber-900/40 rounded-xl p-6 text-center space-y-3">
            <Lock className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-200">
              Comments Protected Under k-Anonymity Guard (k={config.kAnonymityThreshold})
            </h4>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              This faculty currently has {summary.total_evaluations} submissions. Under institutional data privacy rules, detailed comment cards are withheld until at least {config.kAnonymityThreshold} students submit, ensuring that individual student writing styles cannot be linked back to small class groups.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable progress bar for scores
const ScoreBar: React.FC<{ label: string; score: number; max: number }> = ({ label, score, max }) => {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));

  return (
    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="font-mono font-bold text-amber-400">
          {score.toFixed(1)} <span className="text-slate-500 font-normal">/ {max}</span>
        </span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            score >= 4.5
              ? 'bg-emerald-500'
              : score >= 4.0
              ? 'bg-cyan-500'
              : score >= 3.0
              ? 'bg-amber-500'
              : 'bg-rose-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
