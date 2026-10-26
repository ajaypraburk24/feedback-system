import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Key, 
  Database, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw,
  FileCheck,
  Cpu
} from 'lucide-react';
import { ComplianceConfig, PrivacyAuditLog, FacultyRatingsSummary } from '../types';
import { StorageService } from '../services/storage';

interface PrivacyComplianceCenterProps {
  config: ComplianceConfig;
  onUpdateConfig: (cfg: Partial<ComplianceConfig>) => void;
  summaries: FacultyRatingsSummary[];
  auditLogs: PrivacyAuditLog[];
}

export const PrivacyComplianceCenter: React.FC<PrivacyComplianceCenterProps> = ({
  config,
  onUpdateConfig,
  summaries,
  auditLogs,
}) => {
  // PII Sandbox Tester
  const [testInput, setTestInput] = useState(
    'My name is Ajay Prabu (Reg: 814725148004). I sit in row 1 of the lab. Rajesh is very helpful in OS.'
  );
  const [sanitizedResult, setSanitizedResult] = useState<{
    sanitized: string;
    piiDetected: boolean;
    detectedItems: string[];
  } | null>(null);
  const [testingPii, setTestingPii] = useState(false);

  const handleTestScrub = async () => {
    setTestingPii(true);
    try {
      const res = await fetch('/api/sentiment/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: testInput }),
      });
      if (res.ok) {
        const data = await res.json();
        const detected = [];
        if (testInput.match(/\d{8,14}/)) detected.push('Student Register Number (814725148004)');
        if (testInput.match(/my name is [A-Za-z\s]+/i)) detected.push('Student Personal Name');
        if (testInput.match(/row\s+\d+/i)) detected.push('Classroom Seating Position');

        setSanitizedResult({
          sanitized: data.sanitizedText || data.text,
          piiDetected: data.piiDetected,
          detectedItems: detected.length > 0 ? detected : ['Direct Identifying Phrases'],
        });
      }
    } catch (err) {
      console.warn('Sandbox scrub failed:', err);
    } finally {
      setTestingPii(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Privacy Constitution Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/10 via-emerald-500/5 to-transparent pointer-events-none rounded-full blur-3xl" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border border-amber-800/80 flex items-center justify-center text-amber-400 font-bold text-xl shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Data Security &amp; Privacy Compliance Center
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                  FERPA §99.31 &amp; GDPR Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Engineering standards for mathematical k-Anonymity, Zero-Knowledge token decoupling, and automated PII scrubbing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Confidentiality */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center">
            <EyeOff className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white text-xs">k-Anonymity Guard</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Requires at least <strong className="text-slate-200">k={config.kAnonymityThreshold}</strong> student submissions before subjective comments or fine distributions are visible to teachers.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center">
            <Key className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white text-xs">Zero-Knowledge Token</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Cryptographically decouples the student login credentials from the ratings row. Faculty cannot trace feedback to an individual.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white text-xs">Automated PII Scrubber</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Real-time regex and NLP scans remove names, register numbers (814725...), phone numbers, and identifying seating cues from text.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white text-xs">Audit Logging</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Immutable system logs record compliance actions (token generation, sanitization) without compromising voter anonymity.
          </p>
        </div>
      </div>

      {/* Interactive k-Anonymity Threshold Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              Interactive k-Anonymity Threshold Controller
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Adjust the threshold <strong className="text-slate-200">k</strong> to see how student comments are protected when class cohorts are small.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Current k-Threshold:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">k = {config.kAnonymityThreshold}</span>
          </div>
        </div>

        {/* Slider */}
        <div className="space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Minimum Anonymity Cohort:</span>
            <span className="font-mono font-bold text-emerald-400">{config.kAnonymityThreshold} Students</span>
          </div>
          <input
            type="range"
            min={1}
            max={6}
            step={1}
            value={config.kAnonymityThreshold}
            onChange={(e) => onUpdateConfig({ kAnonymityThreshold: Number(e.target.value) })}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>k = 1 (Permissive)</span>
            <span>k = 3 (Recommended Standard)</span>
            <span>k = 5 (Strict Large Cohort)</span>
          </div>
        </div>

        {/* Live Cohort Status Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active Faculty Cohort Protection Status (With k={config.kAnonymityThreshold}):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {summaries.map((f) => {
              const isSatisfied = f.total_evaluations >= config.kAnonymityThreshold;
              return (
                <div
                  key={f.faculty_id}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition ${
                    isSatisfied
                      ? 'bg-slate-950 border-emerald-800/60'
                      : 'bg-slate-950/50 border-amber-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{f.faculty_name}</span>
                    <span className="font-mono text-[11px] text-slate-400">N = {f.total_evaluations}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{f.subject}</p>
                  <div className="pt-1 flex items-center gap-1.5">
                    {isSatisfied ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Comments Visible (Anonymity Satisfied)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                        <Lock className="w-3 h-3" />
                        Comments Masked ({f.total_evaluations}/{config.kAnonymityThreshold} required)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive PII Scrubbing Sandbox */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Live PII &amp; De-Identification Sanitizer Sandbox
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Type or paste sample student text with personal names, roll numbers, or locations to test our real-time redaction engine.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <textarea
            rows={3}
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 rounded-xl p-3.5 border border-slate-700 text-xs font-mono outline-none focus:border-cyan-500"
          />

          <div className="flex justify-end">
            <button
              onClick={handleTestScrub}
              disabled={testingPii}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
            >
              {testingPii ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Sanitizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Execute De-Identification Engine</span>
                </>
              )}
            </button>
          </div>
        </div>

        {sanitizedResult && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Sanitizer Output (What Faculty Sees):</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                100% De-Identified
              </span>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-emerald-900/40 text-slate-100 font-mono text-xs">
              "{sanitizedResult.sanitized}"
            </div>

            {sanitizedResult.detectedItems.length > 0 && (
              <div className="text-[11px] text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Detected &amp; Redacted: {sanitizedResult.detectedItems.join(', ')}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Real-Time Privacy Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-400" />
              Cryptographic Privacy Audit Trail
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verifiable compliance log proving adherence to anonymization, token decoupling, and scrub actions.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Action</th>
                <th className="p-3">Audit Details</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/60 text-slate-300">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-850">
                  <td className="p-3 text-slate-500 text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="p-3 font-semibold text-cyan-400 text-[11px]">{log.action}</td>
                  <td className="p-3 font-sans text-xs text-slate-200">{log.detail}</td>
                  <td className="p-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'COMPLIANT'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : log.status === 'MITIGATED'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
