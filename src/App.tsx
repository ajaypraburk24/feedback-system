import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StudentModule } from './components/StudentModule';
import { FacultyModule } from './components/FacultyModule';
import { AdminModule } from './components/AdminModule';
import { PrivacyComplianceCenter } from './components/PrivacyComplianceCenter';
import { PdfArchitectureViewer } from './components/PdfArchitectureViewer';
import { TerminalOutputModal } from './components/TerminalOutputModal';
import { Student, Faculty, ComplianceConfig, FacultyRatingsSummary, PrivacyAuditLog } from './types';
import { StorageService } from './services/storage';
import { ShieldCheck, Heart, Sparkles, BookOpen, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'student' | 'faculty' | 'admin' | 'privacy' | 'source_code'>('student');
  const [currentRole, setCurrentRole] = useState<'student' | 'faculty' | 'admin'>('student');

  const [students, setStudents] = useState<Student[]>(StorageService.getStudents());
  const [facultyList, setFacultyList] = useState<Faculty[]>(StorageService.getFaculty());
  const [config, setConfig] = useState<ComplianceConfig>(StorageService.getConfig());
  const [summaries, setSummaries] = useState<FacultyRatingsSummary[]>(StorageService.getAllFacultySummaries());
  const [auditLogs, setAuditLogs] = useState<PrivacyAuditLog[]>(StorageService.getAuditLogs());

  // Selected student & faculty
  const [selectedStudent, setSelectedStudent] = useState<Student>(students[0]);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty>(facultyList[0]);

  // Terminal Modal
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const refreshAllData = () => {
    setStudents(StorageService.getStudents());
    setFacultyList(StorageService.getFaculty());
    setConfig(StorageService.getConfig());
    setSummaries(StorageService.getAllFacultySummaries());
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleUpdateConfig = (cfg: Partial<ComplianceConfig>) => {
    const updated = StorageService.updateConfig(cfg);
    setConfig(updated);
    setSummaries(StorageService.getAllFacultySummaries());
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleViewFacultyReport = (facultyId: number) => {
    const target = facultyList.find((f) => f.faculty_id === facultyId) || facultyList[0];
    setSelectedFaculty(target);
    setCurrentRole('faculty');
    setActiveTab('faculty');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
        selectedFaculty={selectedFaculty}
        setSelectedFaculty={setSelectedFaculty}
        students={students}
        facultyList={facultyList}
        onOpenTerminal={() => setIsTerminalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'student' && (
          <StudentModule
            currentStudent={selectedStudent}
            facultyList={facultyList}
            config={config}
            onFeedbackSubmitted={refreshAllData}
            onViewFacultyReport={handleViewFacultyReport}
          />
        )}

        {activeTab === 'faculty' && (
          <FacultyModule
            currentFaculty={selectedFaculty}
            allFaculty={facultyList}
            onSelectFaculty={setSelectedFaculty}
            config={config}
            onOpenPrivacyInfo={() => setActiveTab('privacy')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminModule
            students={students}
            facultyList={facultyList}
            config={config}
            onUpdateConfig={handleUpdateConfig}
            onViewFacultyReport={handleViewFacultyReport}
            onRefreshData={refreshAllData}
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacyComplianceCenter
            config={config}
            onUpdateConfig={handleUpdateConfig}
            summaries={summaries}
            auditLogs={auditLogs}
          />
        )}

        {activeTab === 'source_code' && <PdfArchitectureViewer />}
      </main>

      {/* Terminal Output Modal (Page 29 Replica) */}
      <TerminalOutputModal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />

      {/* Institutional Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 text-xs text-slate-400 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="font-bold text-slate-200">TEACHERS FEEDBACK SYSTEM</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono">
                Project Ref: 814725148003 • 814725148004 • 814725148062
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Department of Computer Science &amp; Engineering • Autonomous Educational Platform
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setActiveTab('privacy')}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>FERPA &amp; GDPR Matrix</span>
            </button>

            <button
              onClick={() => setIsTerminalOpen(true)}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition font-mono"
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>JDK 17 Console</span>
            </button>

            <button
              onClick={() => setActiveTab('source_code')}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>PDF Specification</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
