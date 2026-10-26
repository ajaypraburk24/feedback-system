import React from 'react';
import { 
  ShieldCheck, 
  GraduationCap, 
  UserCheck, 
  Shield, 
  Terminal, 
  FileCode2, 
  Settings2,
  Lock,
  Sparkles
} from 'lucide-react';
import { Student, Faculty } from '../types';

interface NavbarProps {
  activeTab: 'student' | 'faculty' | 'admin' | 'privacy' | 'source_code';
  setActiveTab: (tab: 'student' | 'faculty' | 'admin' | 'privacy' | 'source_code') => void;
  currentRole: 'student' | 'faculty' | 'admin';
  setCurrentRole: (role: 'student' | 'faculty' | 'admin') => void;
  selectedStudent: Student;
  setSelectedStudent: (student: Student) => void;
  selectedFaculty: Faculty;
  setSelectedFaculty: (faculty: Faculty) => void;
  students: Student[];
  facultyList: Faculty[];
  onOpenTerminal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  selectedStudent,
  setSelectedStudent,
  selectedFaculty,
  setSelectedFaculty,
  students,
  facultyList,
  onOpenTerminal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xl">
      {/* Top institution & compliance notification bar */}
      <div className="bg-slate-950/80 px-4 py-1.5 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50 text-[11px] font-mono font-medium">
            <ShieldCheck className="w-3 h-3 mr-1 inline" />
            FERPA &amp; GDPR COMPLIANT
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline">Zero-Knowledge Tokenized Feedback</span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline font-mono text-cyan-400">k-Anonymity (k &ge; 3) Active</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-xs transition border border-slate-700 font-mono"
            title="Launch Java Terminal Output as shown in PDF Page 29"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Java JDK-17 Terminal CLI</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo & System Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Teachers Feedback System
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                  AI Sentiment &amp; Privacy
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Department of Computer Science &amp; Engineering • Anna University Affiliated College
              </p>
            </div>
          </div>

          {/* Persona Switcher Dropdown */}
          <div className="flex items-center gap-2 bg-slate-950/70 p-1.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 px-2 text-xs font-medium text-slate-400">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Role:</span>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => {
                  setCurrentRole('student');
                  setActiveTab('student');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  currentRole === 'student'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>

              <button
                onClick={() => {
                  setCurrentRole('faculty');
                  setActiveTab('faculty');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  currentRole === 'faculty'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Faculty</span>
              </button>

              <button
                onClick={() => {
                  setCurrentRole('admin');
                  setActiveTab('admin');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  currentRole === 'admin'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Sub-selector for active student or faculty */}
            {currentRole === 'student' && (
              <select
                value={selectedStudent.student_id}
                onChange={(e) => {
                  const s = students.find((st) => st.student_id === Number(e.target.value));
                  if (s) setSelectedStudent(s);
                }}
                className="bg-slate-900 text-slate-200 text-xs rounded-lg px-2 py-1.5 border border-slate-700 outline-none focus:border-cyan-500"
              >
                {students.map((s) => (
                  <option key={s.student_id} value={s.student_id}>
                    {s.student_name} ({s.reg_no || s.student_id})
                  </option>
                ))}
              </select>
            )}

            {currentRole === 'faculty' && (
              <select
                value={selectedFaculty.faculty_id}
                onChange={(e) => {
                  const f = facultyList.find((fc) => fc.faculty_id === Number(e.target.value));
                  if (f) setSelectedFaculty(f);
                }}
                className="bg-slate-900 text-slate-200 text-xs rounded-lg px-2 py-1.5 border border-slate-700 outline-none focus:border-indigo-500"
              >
                {facultyList.map((f) => (
                  <option key={f.faculty_id} value={f.faculty_id}>
                    {f.faculty_name} ({f.subject})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Tab Navigation links */}
        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-800/60 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('student')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'student'
                ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Feedback Portal (Real-Time Sentiment)</span>
          </button>

          <button
            onClick={() => setActiveTab('faculty')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'faculty'
                ? 'bg-slate-800 text-indigo-400 border-b-2 border-indigo-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Faculty Anonymous Reports (Aggregated)</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'admin'
                ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            <span>Administrator Control Center</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'privacy'
                ? 'bg-slate-800 text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Data Security &amp; Privacy Compliance</span>
          </button>

          <button
            onClick={() => setActiveTab('source_code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'source_code'
                ? 'bg-slate-800 text-purple-400 border-b-2 border-purple-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>PDF Project Code (Java/SQL/JDBC)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
