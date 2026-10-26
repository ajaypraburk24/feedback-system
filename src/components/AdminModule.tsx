import React, { useState } from 'react';
import { 
  Settings2, 
  Users, 
  UserCheck, 
  GraduationCap, 
  Database, 
  BarChart3, 
  Plus, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Shield
} from 'lucide-react';
import { Student, Faculty, ComplianceConfig, FacultyRatingsSummary } from '../types';
import { StorageService } from '../services/storage';

interface AdminModuleProps {
  students: Student[];
  facultyList: Faculty[];
  config: ComplianceConfig;
  onUpdateConfig: (cfg: Partial<ComplianceConfig>) => void;
  onViewFacultyReport: (facultyId: number) => void;
  onRefreshData: () => void;
}

export const AdminModule: React.FC<AdminModuleProps> = ({
  students,
  facultyList,
  config,
  onUpdateConfig,
  onViewFacultyReport,
  onRefreshData,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'faculty' | 'students' | 'database' | 'session'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Add Faculty Form State
  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [newFacultyName, setNewFacultyName] = useState('');
  const [newDepartment, setNewDepartment] = useState('CSE (AI & ML)');
  const [newSubject, setNewSubject] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Add Student Form State
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentDept, setNewStudentDept] = useState('CSE (AI & ML)');
  const [newStudentYear, setNewStudentYear] = useState(2);
  const [newStudentReg, setNewStudentReg] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');

  const summaries: FacultyRatingsSummary[] = StorageService.getAllFacultySummaries();
  const feedbackList = StorageService.getFeedbackList();
  const tokens = StorageService.getTokens();

  // Institution KPIs
  const totalSubmissions = feedbackList.length;
  const overallAvg =
    summaries.length > 0
      ? Number((summaries.reduce((acc, s) => acc + s.avg_overall_rating, 0) / summaries.length).toFixed(2))
      : 0;

  // Handle adding new faculty
  const handleCreateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacultyName || !newSubject) return;

    StorageService.addFaculty({
      faculty_name: newFacultyName,
      department: newDepartment,
      subject: newSubject,
      email: newEmail || `${newFacultyName.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
      designation: 'Assistant Professor',
      cabin: 'CS-Block Room 105',
    });

    setNewFacultyName('');
    setNewSubject('');
    setNewEmail('');
    setShowAddFaculty(false);
    onRefreshData();
  };

  // Handle adding new student
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName) return;

    StorageService.addStudent({
      student_name: newStudentName,
      department: newStudentDept,
      year: newStudentYear,
      reg_no: newStudentReg || `814725148${Math.floor(100 + Math.random() * 900)}`,
      email: newStudentEmail || `${newStudentName.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
      password: 'password123',
    });

    setNewStudentName('');
    setNewStudentReg('');
    setNewStudentEmail('');
    setShowAddStudent(false);
    onRefreshData();
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all feedback and records back to initial prototype benchmark data?')) {
      StorageService.resetToDefaults();
      onRefreshData();
    }
  };

  // Department Aggregates dynamically computed
  const departments = Array.from(new Set(facultyList.map((f) => f.department)));
  const departmentStats = departments.map((d) => {
    const matched = summaries.filter((f) => f.department === d);
    const avg =
      matched.length > 0
        ? Number((matched.reduce((acc, m) => acc + m.avg_overall_rating, 0) / matched.length).toFixed(1))
        : 4.8;
    return { name: d, count: matched.length, avg };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Chapter 7.3 Administrator Module
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
              Central Control Authority
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Administrator Management Dashboard</h1>
          <p className="text-xs text-slate-400">
            Monitoring faculty evaluations, student registries, MySQL database records, and session control.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition"
            title="Reset system to default seed dataset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Dataset</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Total Faculty Members</span>
          <p className="text-2xl font-bold text-white mt-1">{facultyList.length}</p>
          <span className="text-[11px] text-emerald-400 mt-1 block">Active across 3 Departments</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Enrolled Students</span>
          <p className="text-2xl font-bold text-white mt-1">{students.length}</p>
          <span className="text-[11px] text-cyan-400 mt-1 block">Authorized for {config.currentSemester}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Total Evaluations Recorded</span>
          <p className="text-2xl font-bold text-white mt-1">{totalSubmissions}</p>
          <span className="text-[11px] text-emerald-400 mt-1 block">100% Anonymous &amp; Decoupled</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Institution Average Rating</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">{overallAvg} / 5.0</p>
          <span className="text-[11px] text-slate-400 mt-1 block">★★★★★ High Benchmark</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeSubTab === 'overview' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Overview &amp; Department Performance
        </button>

        <button
          onClick={() => setActiveSubTab('faculty')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeSubTab === 'faculty' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Faculty Performance Roster ({facultyList.length})
        </button>

        <button
          onClick={() => setActiveSubTab('students')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeSubTab === 'students' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Student Registry &amp; Completion Status ({students.length})
        </button>

        <button
          onClick={() => setActiveSubTab('session')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeSubTab === 'session' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Session Controller (Duration &amp; Access)
        </button>

        <button
          onClick={() => setActiveSubTab('database')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeSubTab === 'database' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          MySQL Schema &amp; Raw Tables
        </button>
      </div>

      {/* Sub-tab 1: Overview */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Department Rankings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Department Performance Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {departmentStats.map((dept, i) => (
                <div key={i} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 text-xs">{dept.name}</span>
                    <span className="font-mono text-xs font-bold text-amber-400">{dept.avg} / 5.0</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div style={{ width: `${(dept.avg / 5) * 100}%` }} className="h-full bg-emerald-500 rounded-full" />
                  </div>
                  <p className="text-[11px] text-slate-500">{dept.count} Faculty Assigned</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Faculty Leaderboard */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Faculty Performance Rankings ({config.currentSemester})
              </h3>
              <span className="text-xs text-slate-500">Sorted by Calculated Overall Score</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                    <th className="pb-3">Faculty</th>
                    <th className="pb-3">Subject &amp; Dept</th>
                    <th className="pb-3 text-center">Evaluations</th>
                    <th className="pb-3 text-center">Teaching</th>
                    <th className="pb-3 text-center">Overall Rating</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {summaries
                    .sort((a, b) => b.avg_overall_rating - a.avg_overall_rating)
                    .map((item) => (
                      <tr key={item.faculty_id} className="hover:bg-slate-850/50 transition">
                        <td className="py-3 font-medium text-slate-200">{item.faculty_name}</td>
                        <td className="py-3 text-slate-400">
                          <div>{item.subject}</div>
                          <div className="text-[11px] text-slate-500">{item.department}</div>
                        </td>
                        <td className="py-3 text-center font-mono text-slate-300">{item.total_evaluations}</td>
                        <td className="py-3 text-center font-mono text-cyan-400 font-semibold">
                          {item.avg_teaching.toFixed(1)}
                        </td>
                        <td className="py-3 text-center font-mono font-bold text-amber-400">
                          {item.avg_overall_rating.toFixed(1)} / 5.0
                        </td>
                        <td className="py-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.performance_status === 'EXCELLENT'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {item.performance_status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => onViewFacultyReport(item.faculty_id)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                          >
                            Report &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Faculty Roster */}
      {activeSubTab === 'faculty' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search faculty name, department, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={() => setShowAddFaculty(!showAddFaculty)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Teacher</span>
            </button>
          </div>

          {showAddFaculty && (
            <form onSubmit={handleCreateFaculty} className="bg-slate-900 border border-emerald-800/50 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Add Teacher Record</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Teacher Name (e.g. Dr. K. Ramesh)"
                  value={newFacultyName}
                  onChange={(e) => setNewFacultyName(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Subject (e.g. Compiler Design)"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  required
                />
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                >
                  <option value="CSE (AI & ML)">CSE (AI &amp; ML)</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics & Communication">Electronics &amp; Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
                <input
                  type="email"
                  placeholder="Email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFaculty(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Save Record
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facultyList
              .filter(
                (f) =>
                  f.faculty_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  f.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  f.department.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((faculty) => {
                const s = summaries.find((sm) => sm.faculty_id === faculty.faculty_id);
                return (
                  <div
                    key={faculty.faculty_id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">{faculty.faculty_name}</h4>
                        <p className="text-xs text-cyan-400 font-medium">{faculty.subject}</p>
                        <p className="text-[11px] text-slate-400">{faculty.department}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/40 border border-amber-900/40">
                        {s ? `${s.avg_overall_rating.toFixed(1)} / 5.0` : 'No reviews'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>{s ? `${s.total_evaluations} submissions` : '0 evaluations'}</span>
                      <button
                        onClick={() => onViewFacultyReport(faculty.faculty_id)}
                        className="text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        View Performance Report &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Sub-tab 3: Student Registry */}
      {activeSubTab === 'students' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Authorized Student Registry
              </h3>
              <p className="text-xs text-slate-500">
                Students can only evaluate faculty handling their department subjects.
              </p>
            </div>

            <button
              onClick={() => setShowAddStudent(!showAddStudent)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Register Student</span>
            </button>
          </div>

          {showAddStudent && (
            <form onSubmit={handleCreateStudent} className="bg-slate-900 border border-emerald-800/50 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Register Student</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Student Full Name"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Register No (e.g. 814725148004)"
                  value={newStudentReg}
                  onChange={(e) => setNewStudentReg(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
                <select
                  value={newStudentDept}
                  onChange={(e) => setNewStudentDept(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                >
                  <option value="CSE (AI & ML)">CSE (AI &amp; ML)</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics & Communication">Electronics &amp; Communication</option>
                </select>
                <input
                  type="email"
                  placeholder="Email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudent(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Add Student
                </button>
              </div>
            </form>
          )}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px] bg-slate-950/40">
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Register No</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">Completed Evaluations</th>
                  <th className="p-3">Eligible Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {students.map((st) => {
                  const completedCount = tokens.filter((t) => t.student_id === st.student_id).length;
                  return (
                    <tr key={st.student_id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-medium text-white">{st.student_name}</td>
                      <td className="p-3 font-mono text-cyan-400">{st.reg_no || st.student_id}</td>
                      <td className="p-3 text-slate-300">{st.department}</td>
                      <td className="p-3 text-slate-400">Year {st.year}</td>
                      <td className="p-3 font-mono text-emerald-400 font-semibold">{completedCount} of 5</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Authorized
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 4: Session Controller */}
      {activeSubTab === 'session' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              Feedback Session &amp; Duration Controller
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Control feedback collection windows, semester scheduling, and enrollment access.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">Current Academic Session</label>
              <select
                value={config.currentSemester}
                onChange={(e) => onUpdateConfig({ currentSemester: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-emerald-500"
              >
                <option value="Semester 3 (Year 2)">Semester 3 (Year 2)</option>
                <option value="Semester 4 (Year 2)">Semester 4 (Year 2)</option>
                <option value="Semester 5 (Year 3)">Semester 5 (Year 3)</option>
              </select>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">Feedback Window Status</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ feedbackSessionOpen: true })}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition ${
                    config.feedbackSessionOpen
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Active &amp; Open
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ feedbackSessionOpen: false })}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition ${
                    !config.feedbackSessionOpen
                      ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Closed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 5: MySQL Database Schema & Table Explorer */}
      {activeSubTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-400" />
                  MySQL Relational Tables (TeachersFeedbackSystem Schema)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Replicating the exact relational architecture defined in Chapter 8 of the project documentation.
                </p>
              </div>
            </div>

            {/* Feedback Table Preview with Zero-Knowledge Decoupling */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-300 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span>TABLE: Feedback (feedback_id, faculty_id, teaching, communication, subject_knowledge, punctuality, classroom_interaction, overall_rating, comments, blind_token)</span>
                <span className="text-emerald-400 font-sans font-bold">Strictly Anonymous</span>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-[11px] font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">ID</th>
                      <th className="p-2.5">Faculty</th>
                      <th className="p-2.5">Teach</th>
                      <th className="p-2.5">Comm</th>
                      <th className="p-2.5">Know</th>
                      <th className="p-2.5">Punct</th>
                      <th className="p-2.5">Inter</th>
                      <th className="p-2.5">Overall</th>
                      <th className="p-2.5">Sentiment</th>
                      <th className="p-2.5">Blind Token</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/60 text-slate-300">
                    {feedbackList.map((f) => {
                      const faculty = facultyList.find((fc) => fc.faculty_id === f.faculty_id);
                      return (
                        <tr key={f.feedback_id} className="hover:bg-slate-800/40">
                          <td className="p-2.5 text-cyan-400">#{f.feedback_id}</td>
                          <td className="p-2.5 font-sans font-medium text-slate-200">{faculty?.faculty_name || `ID #${f.faculty_id}`}</td>
                          <td className="p-2.5 text-center">{f.teaching}</td>
                          <td className="p-2.5 text-center">{f.communication}</td>
                          <td className="p-2.5 text-center">{f.subject_knowledge}</td>
                          <td className="p-2.5 text-center">{f.punctuality}</td>
                          <td className="p-2.5 text-center">{f.classroom_interaction}</td>
                          <td className="p-2.5 text-center font-bold text-amber-400">{f.overall_rating}</td>
                          <td className="p-2.5 font-sans">
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                              {f.sentiment_label || 'Positive'}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-500 font-mono text-[10px]">{f.blind_token?.substring(0, 14)}...</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
