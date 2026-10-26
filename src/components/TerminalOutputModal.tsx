import React, { useState } from 'react';
import { Terminal, X, Play, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react';

interface TerminalOutputModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TerminalOutputModal: React.FC<TerminalOutputModalProps> = ({ isOpen, onClose }) => {
  const [screen, setScreen] = useState<'menu' | 'student_login' | 'faculty_report' | 'submit_feedback' | 'db_save'>('faculty_report');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
        {/* Terminal Title Bar */}
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[11px] text-slate-400 font-mono ml-2">
              C:\Program Files\Java\jdk-17\bin\java.exe - TEACHERS FEEDBACK SYSTEM (PDF Page 29)
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Switcher Chips */}
        <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800 flex flex-wrap gap-1.5 text-[11px]">
          <span className="text-slate-500 py-1 mr-1">PDF Page 29 Views:</span>
          <button
            onClick={() => setScreen('student_login')}
            className={`px-2.5 py-1 rounded transition ${
              screen === 'student_login' ? 'bg-cyan-900/80 text-cyan-300 border border-cyan-700' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            (a) Student Login
          </button>
          <button
            onClick={() => setScreen('faculty_report')}
            className={`px-2.5 py-1 rounded transition ${
              screen === 'faculty_report' ? 'bg-cyan-900/80 text-cyan-300 border border-cyan-700' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            (b) Admin Report View
          </button>
          <button
            onClick={() => setScreen('submit_feedback')}
            className={`px-2.5 py-1 rounded transition ${
              screen === 'submit_feedback' ? 'bg-cyan-900/80 text-cyan-300 border border-cyan-700' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            (c) Feedback Form (Student)
          </button>
          <button
            onClick={() => setScreen('db_save')}
            className={`px-2.5 py-1 rounded transition ${
              screen === 'db_save' ? 'bg-cyan-900/80 text-cyan-300 border border-cyan-700' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            (d) Database Save &amp; Report
          </button>
        </div>

        {/* Terminal Screen Body */}
        <div className="p-6 bg-black min-h-[380px] text-emerald-400 font-mono text-xs leading-relaxed select-text overflow-x-auto">
          {screen === 'student_login' && (
            <div className="space-y-1">
              <p className="text-slate-400">=============================================</p>
              <p className="text-white font-bold tracking-wider">        TEACHERS FEEDBACK SYSTEM</p>
              <p className="text-slate-400">=============================================</p>
              <p>1. Student Login</p>
              <p>2. Admin Login</p>
              <p>3. Exit</p>
              <p className="text-cyan-300">Enter Choice : 1</p>
              <br />
              <p className="text-slate-400">---------------------------------------------</p>
              <p className="text-yellow-300 font-bold">              STUDENT LOGIN</p>
              <p className="text-slate-400">---------------------------------------------</p>
              <p>Student ID  : 101</p>
              <p>Password    : ******</p>
              <p className="text-emerald-300 font-bold">Login Successful...</p>
              <br />
              <p className="text-slate-500 animate-pulse">Press Enter to continue _</p>
            </div>
          )}

          {screen === 'faculty_report' && (
            <div className="space-y-1">
              <p className="text-slate-400">=============================================</p>
              <p className="text-white font-bold tracking-wider">        TEACHERS FEEDBACK SYSTEM</p>
              <p className="text-slate-400">=============================================</p>
              <p>1. View Feedback Reports</p>
              <p>2. Manage Faculty</p>
              <p>3. Logout</p>
              <p className="text-cyan-300">Enter Choice : 1</p>
              <br />
              <p className="text-slate-400">---------------------------------------------</p>
              <p className="text-yellow-300 font-bold">          FACULTY FEEDBACK REPORT</p>
              <p className="text-slate-400">---------------------------------------------</p>
              <p><span className="text-slate-400">Faculty Name      :</span> <strong className="text-white">Rajesh</strong></p>
              <p><span className="text-slate-400">Department        :</span> Computer Science &amp; Engineering</p>
              <p><span className="text-slate-400">Subject           :</span> Operating Systems (OS)</p>
              <br />
              <p className="text-cyan-400">----------- Average Ratings ------------</p>
              <p>Teaching Quality         : 4.8 / 5</p>
              <p>Subject Knowledge        : 4.9 / 5</p>
              <p>Communication Skills     : 4.6 / 5</p>
              <p>Punctuality              : 4.9 / 5</p>
              <p>Classroom Interaction    : 4.7 / 5</p>
              <p className="text-white font-bold">Overall Rating           : 4.8 / 5</p>
              <br />
              <p className="text-cyan-400">--------- Performance Status -----------</p>
              <p className="text-amber-300 font-bold text-sm tracking-wider">          ★★★★★ EXCELLENT</p>
              <br />
              <p className="text-slate-300">Total Students Submitted Feedback : 58</p>
              <p className="text-slate-500 animate-pulse">Press Enter to Continue _</p>
            </div>
          )}

          {screen === 'submit_feedback' && (
            <div className="space-y-1">
              <p className="text-slate-400">=============================================</p>
              <p className="text-white font-bold tracking-wider">        TEACHERS FEEDBACK SYSTEM</p>
              <p className="text-slate-400">=============================================</p>
              <p className="text-yellow-300 font-bold">FEEDBACK FORM</p>
              <p>Teaching Quality (1-5)         : 5</p>
              <p>Subject Knowledge (1-5)        : 5</p>
              <p>Communication Skills (1-5)     : 4</p>
              <p>Punctuality (1-5)              : 5</p>
              <p>Classroom Interaction (1-5)    : 4</p>
              <p>Overall Satisfaction (1-5)     : 5</p>
              <br />
              <p className="text-slate-400">Any Suggestions :</p>
              <p className="text-cyan-200 italic">Excellent teaching and easy explanation.</p>
              <br />
              <p className="text-emerald-400 font-bold">Feedback Submitted Successfully...</p>
              <p className="text-slate-500 animate-pulse">Press Enter to Continue _</p>
            </div>
          )}

          {screen === 'db_save' && (
            <div className="space-y-1">
              <p className="text-cyan-400">Connecting to MySQL Database...</p>
              <p className="text-emerald-400 font-semibold">Database Connected Successfully.</p>
              <br />
              <p className="text-slate-400">Saving Feedback into table Feedback...</p>
              <p className="text-emerald-400 font-semibold">Feedback Saved Successfully.</p>
              <br />
              <p className="text-slate-400">Generating Report via SQL AVG Query...</p>
              <p className="text-emerald-400 font-semibold">Report Generated Successfully.</p>
              <br />
              <p className="text-yellow-300">Thank You for Using Teachers Feedback System.</p>
              <p className="text-slate-500 animate-pulse">Press Enter to Exit _</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-900 px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Direct execution output from compiled Java bytecode (<code className="text-slate-200">Main.class</code>)</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition"
          >
            Close Terminal
          </button>
        </div>
      </div>
    </div>
  );
};
