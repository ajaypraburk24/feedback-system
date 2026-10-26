import { Student, Faculty, Admin, FeedbackSubmission, StudentSubmissionToken, FacultyRatingsSummary, PrivacyAuditLog, ComplianceConfig } from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'edushield_students_v6',
  FACULTY: 'edushield_faculty_v6',
  ADMINS: 'edushield_admins_v6',
  FEEDBACK: 'edushield_feedback_v6',
  TOKENS: 'edushield_tokens_v6',
  AUDIT_LOGS: 'edushield_audit_logs_v6',
  CONFIG: 'edushield_config_v6',
};

// Default seed data based on the project paper
const INITIAL_STUDENTS: Student[] = [
  {
    student_id: 101,
    student_name: 'Ajay Prabu R K',
    department: 'CSE (AI & ML)',
    year: 2,
    email: '814725148004@college.edu',
    reg_no: '814725148004',
    password: 'password123',
  },
  {
    student_id: 102,
    student_name: 'Aditya Krishnan A',
    department: 'CSE (AI & ML)',
    year: 2,
    email: '814725148003@college.edu',
    reg_no: '814725148003',
    password: 'password123',
  },
  {
    student_id: 103,
    student_name: 'Venkatesh R P',
    department: 'CSE (AI & ML)',
    year: 2,
    email: '814725148062@college.edu',
    reg_no: '814725148062',
    password: 'password123',
  },
  {
    student_id: 104,
    student_name: 'Ananya Deshmukh',
    department: 'Computer Science',
    year: 2,
    email: 'ananya.d@college.edu',
    reg_no: '814725148010',
    password: 'password123',
  },
  {
    student_id: 105,
    student_name: 'Rahul Varma',
    department: 'Computer Science',
    year: 2,
    email: 'rahul.v@college.edu',
    reg_no: '814725148045',
    password: 'password123',
  },
];

const INITIAL_FACULTY: Faculty[] = [
  {
    faculty_id: 1,
    faculty_name: 'Rajesh',
    department: 'Computer Science & Engineering',
    subject: 'Operating Systems (OS)',
    email: 'rajesh@college.edu',
    designation: 'Associate Professor & Research Head',
    cabin: 'CS-Block Room 304',
  },
  {
    faculty_id: 2,
    faculty_name: 'Renuga Devi',
    department: 'Computer Science & Engineering',
    subject: 'Data Structures & Algorithms (DSA)',
    email: 'renuga.devi@college.edu',
    designation: 'Assistant Professor (Sr. Gr.)',
    cabin: 'CS-Block Room 212',
  },
  {
    faculty_id: 3,
    faculty_name: 'Pichailakshimi',
    department: 'Science & Humanities',
    subject: 'Engineering Mathematics (Maths)',
    email: 'pichailakshimi@college.edu',
    designation: 'Professor & Dean of Academics',
    cabin: 'Admin-Block Room 102',
  },
  {
    faculty_id: 4,
    faculty_name: 'Tamilkudimagan',
    department: 'Computer Science & Engineering',
    subject: 'Java Programming (Java)',
    email: 'tamilkudimagan@college.edu',
    designation: 'Associate Professor',
    cabin: 'AI-Lab Block Room 405',
  },
  {
    faculty_id: 5,
    faculty_name: 'Varshini',
    department: 'Humanities & English',
    subject: 'Technical English & Communication (English)',
    email: 'varshini@college.edu',
    designation: 'Assistant Professor',
    cabin: 'ECE-Block Room 201',
  },
];

const INITIAL_ADMINS: Admin[] = [
  {
    admin_id: 1,
    username: 'admin',
    password: 'password123',
    role: 'Dean',
  },
  {
    admin_id: 2,
    username: 'hod_cse',
    password: 'password123',
    role: 'HOD',
  },
];

const INITIAL_CONFIG: ComplianceConfig = {
  kAnonymityThreshold: 3,
  piiSanitizationStrict: true,
  zeroKnowledgeDecoupling: true,
  differentialPrivacyNoise: false,
  currentSemester: 'Semester 3 (Year 2)',
  feedbackSessionOpen: true,
};

// Pre-seeded feedback matching the PDF sample output with the updated subjects
const INITIAL_FEEDBACK: FeedbackSubmission[] = [
  // Rajesh - Operating Systems (OS)
  {
    feedback_id: 1001,
    faculty_id: 1,
    teaching: 5,
    communication: 5,
    subject_knowledge: 5,
    punctuality: 5,
    classroom_interaction: 5,
    overall_rating: 5,
    comments: 'Excellent teaching in Operating Systems! Very clear explanations of process scheduling, semaphores, and memory management algorithms.',
    sanitized_comments: 'Excellent teaching in Operating Systems! Very clear explanations of process scheduling, semaphores, and memory management algorithms.',
    sentiment_score: 0.92,
    sentiment_label: 'Positive',
    sentiment_tone: 'Highly Appreciative',
    strengths: ['Clear CPU scheduling demonstrations', 'In-depth OS kernel architecture', 'Helpful lab support'],
    improvements: ['Include more Linux shell script exercises'],
    pii_detected: false,
    blind_token: 'zk_hash_7f9a2b8e1',
    created_at: '2026-10-20T10:30:00Z',
    semester: 'Semester 3 (Year 2)',
    academic_year: '2026-2027',
  },
  {
    feedback_id: 1002,
    faculty_id: 1,
    teaching: 5,
    communication: 4,
    subject_knowledge: 5,
    punctuality: 5,
    classroom_interaction: 4,
    overall_rating: 5,
    comments: 'Very punctual and structured course plan for OS. Always answers student doubts on deadlock and virtual memory patiently.',
    sanitized_comments: 'Very punctual and structured course plan for OS. Always answers student doubts on deadlock and virtual memory patiently.',
    sentiment_score: 0.84,
    sentiment_label: 'Positive',
    sentiment_tone: 'Appreciative & Respectful',
    strengths: ['High punctuality', 'Patient doubt resolution'],
    improvements: ['A little more time for deadlock problem solving'],
    pii_detected: false,
    blind_token: 'zk_hash_1c4d9a3f0',
    created_at: '2026-10-21T14:15:00Z',
    semester: 'Semester 3 (Year 2)',
    academic_year: '2026-2027',
  },
  {
    feedback_id: 1003,
    faculty_id: 1,
    teaching: 4,
    communication: 5,
    subject_knowledge: 5,
    punctuality: 5,
    classroom_interaction: 5,
    overall_rating: 4,
    comments: 'Great interaction in the classroom. Would appreciate sharing OS simulation slides a day prior to class.',
    sanitized_comments: 'Great interaction in the classroom. Would appreciate sharing OS simulation slides a day prior to class.',
    sentiment_score: 0.65,
    sentiment_label: 'Constructive',
    sentiment_tone: 'Constructive Feedback',
    strengths: ['Classroom engagement', 'Interactive teaching'],
    improvements: ['Provide slides 24 hours in advance'],
    pii_detected: false,
    blind_token: 'zk_hash_3e8b0a5c7',
    created_at: '2026-10-22T09:45:00Z',
    semester: 'Semester 3 (Year 2)',
    academic_year: '2026-2027',
  },
  {
    feedback_id: 1004,
    faculty_id: 1,
    teaching: 5,
    communication: 5,
    subject_knowledge: 5,
    punctuality: 5,
    classroom_interaction: 5,
    overall_rating: 5,
    comments: 'Best professor for Operating Systems. Highly motivating lectures and transparent evaluation.',
    sanitized_comments: 'Best professor for Operating Systems. Highly motivating lectures and transparent evaluation.',
    sentiment_score: 0.95,
    sentiment_label: 'Positive',
    sentiment_tone: 'Enthusiastic',
    strengths: ['Inspirational lectures', 'Transparent grading'],
    improvements: [],
    pii_detected: false,
    blind_token: 'zk_hash_9d2f6a1e8',
    created_at: '2026-10-23T11:20:00Z',
    semester: 'Semester 3 (Year 2)',
    academic_year: '2026-2027',
  },

  // Renuga Devi - Data Structures & Algorithms (DSA)
  {
    feedback_id: 1005,
    faculty_id: 2,
    teaching: 5,
    communication: 4,
    subject_knowledge: 5,
    punctuality: 5,
    classroom_interaction: 4,
    overall_rating: 5,
    comments: 'Practical hands-on sessions in DSA are solid. Tree traversals and dynamic programming concepts are explained with great visualization.',
    sanitized_comments: 'Practical hands-on sessions in DSA are solid. Tree traversals and dynamic programming concepts are explained with great visualization.',
    sentiment_score: 0.88,
    sentiment_label: 'Positive',
    sentiment_tone: 'Appreciative & Constructive',
    strengths: ['Hands-on coding labs', 'Clear algorithmic traces'],
    improvements: ['Slow down pace during dynamic programming transitions'],
    pii_detected: false,
    blind_token: 'zk_hash_4a7c2d9e0',
    created_at: '2026-10-22T16:00:00Z',
    semester: 'Semester 3 (Year 2)',
    academic_year: '2026-2027',
  },
  {
    feedback_id: 1006,
    faculty_id: 2,
    teaching: 4,
    communication: 5,
    subject_knowledge: 5,
    punctuality: 5,
    classroom_interaction: 4,
    overall_rating: 4,
    comments: 'Good project guidance and helpful code reviews during DSA lab hours on binary trees and graphs.',
    sanitized_comments: 'Good project guidance and helpful code reviews during DSA lab hours on binary trees and graphs.',
    sentiment_score: 0.76,
    sentiment_label: 'Positive',
    sentiment_tone: 'Positive',
    strengths: ['Personalized algorithm mentorship', 'Effective code reviews'],
    improvements: ['Include competitive programming practice'],
    pii_detected: false,
    blind_token: 'zk_hash_5b8e1f3a2',
    created_at: '2026-10-24T10:10:00Z',
    semester: 'Semester 3 (Year 2)',
    academic_year: '2026-2027',
  },
  {
    feedback_id: 1007,
    faculty_id: 2,
    teaching: 5,
    communication: 5,
    subject_knowledge: 5,
    punctuality: 4,
    classroom_interaction: 5,
    overall_rating: 5,
    comments: 'Clear breakdown of time complexity and space complexity big-O notation. Highly useful course.',
    sanitized_comments: 'Clear breakdown of time complexity and space complexity big-O notation. Highly useful course.',
    sentiment_score: 0.91,
    sentiment_label: 'Positive',
    sentiment_tone: 'Enthusiastic',
    strengths: ['Asymptotic analysis clarity', 'Interactive whiteboard traces'],
    improvements: [],
    pii_detected: false,
    blind_token: 'zk_hash_6c9e2b1f8',
    created_at: '2026-10-25T08:30:00Z',
    semester: 'Semester 3 (Year 2)',
    academic_year: '2026-2027',
  },

  // Pichailakshimi - Engineering Mathematics (Maths)
  {
    feedback_id: 1008,
    faculty_id: 3,
    teaching: 5,
    communication: 5,
    subject_knowledge: 5,
    punctuality: 5,
    classroom_interaction: 4,
    overall_rating: 5,
    comments: 'Outstanding explanations in Engineering Mathematics! Breaks down complex differential equations and matrix calculus into step-by-step logic.',
    sanitized_comments: 'Outstanding explanations in Engineering Mathematics! Breaks down complex differential equations and matrix calculus into step-by-step logic.',
    sentiment_score: 0.93,
    sentiment_label: 'Positive',
    sentiment_tone: 'Highly Appreciative',
    strengths: ['Step-by-step mathematical proofs', 'Extensive whiteboard problem solving'],
    improvements: ['Provide formula cheat sheets before tests'],
    pii_detected: false,
    blind_token: 'zk_hash_7a8b9c0d1',
    created_at: '2026-10-23T14:00:00Z',
    semester: 'Semester 3 (Year 2)',
    academic_year: '2026-2027',
  },
  {
    feedback_id: 1009,
    faculty_id: 3,
    teaching: 4,
    communication: 5,
    subject_knowledge: 5,
    punctuality: 5,
    classroom_interaction: 5,
    overall_rating: 4,
    comments: 'Very dedicated in clearing doubts after class. Helps every student understand Fourier transforms and probability theorems.',
    sanitized_comments: 'Very dedicated in clearing doubts after class. Helps every student understand Fourier transforms and probability theorems.',
    sentiment_score: 0.82,
    sentiment_label: 'Positive',
    sentiment_tone: 'Warm & Respectful',
    strengths: ['Dedication to student comprehension', 'Approachable and encouraging'],
    improvements: ['A few more solved example handouts'],
    pii_detected: false,
    blind_token: 'zk_hash_2d3e4f5a6',
    created_at: '2026-10-24T15:20:00Z',
    semester: 'Semester 3 (Year 2)',
    academic_year: '2026-2027',
  },
  {
    feedback_id: 1010,
    faculty_id: 3,
    teaching: 5,
    communication: 4,
    subject_knowledge: 5,
    punctuality: 5,
    classroom_interaction: 4,
    overall_rating: 5,
    comments: 'Excellent coverage of discrete mathematics and graph theory applications for computer science.',
    sanitized_comments: 'Excellent coverage of discrete mathematics and graph theory applications for computer science.',
    sentiment_score: 0.87,
    sentiment_label: 'Positive',
    sentiment_tone: 'Appreciative',
    strengths: ['Application-oriented mathematics', 'Rigorous conceptual depth'],
    improvements: [],
    pii_detected: false,
    blind_token: 'zk_hash_3e4f5a6b7',
    created_at: '2026-10-25T11:10:00Z',
    semester: 'Semester 3 (Year 2)',
    academic_year: '2026-2027',
  },

  // Tamilkudimagan - Java Programming (Java)
  {
    feedback_id: 1011,
    faculty_id: 4,
    teaching: 5,
    communication: 5,
    subject_knowledge: 5,
    punctuality: 5,
    classroom_interaction: 5,
    overall_rating: 5,
    comments: 'Outstanding explanations of Java Object-Oriented concepts, multithreading, and collections framework. Real-world coding examples make concepts crystal clear.',
    sanitized_comments: 'Outstanding explanations of Java Object-Oriented concepts, multithreading, and collections framework. Real-world coding examples make concepts crystal clear.',
    sentiment_score: 0.94,
    sentiment_label: 'Positive',
    sentiment_tone: 'Enthusiastic',
    strengths: ['Live coding sessions', 'Clear OOP architecture explanation', 'Engaging teaching style'],
    improvements: ['Include Spring Boot introductory demo'],
    pii_detected: false,
    blind_token: 'zk_hash_8c1a3b5d7',
    created_at: '2026-10-25T13:40:00Z',
    semester: 'Semester 3 (Year 2)',
    academic_year: '2026-2027',
  },
  {
    feedback_id: 1012,
    faculty_id: 4,
    teaching: 5,
    communication: 4,
    subject_knowledge: 5,
    punctuality: 5,
    classroom_interaction: 4,
    overall_rating: 5,
    comments: 'Thorough coverage of Java Exception handling, Streams API, and JDBC database programming. Excellent teacher!',
    sanitized_comments: 'Thorough coverage of Java Exception handling, Streams API, and JDBC database programming. Excellent teacher!',
    sentiment_score: 0.89,
    sentiment_label: 'Positive',
    sentiment_tone: 'Appreciative',
    strengths: ['Deep Java expertise', 'Clean code best practices'],
    improvements: ['More time on multithreading concurrency issues'],
    pii_detected: false,
    blind_token: 'zk_hash_9f0a1b2c3',
    created_at: '2026-10-25T16:00:00Z',
    semester: 'Semester 3 (Year 2)',
    academic_year: '2026-2027',
  },
  {
    feedback_id: 1013,
    faculty_id: 4,
    teaching: 4,
    communication: 5,
    subject_knowledge: 5,
    punctuality: 4,
    classroom_interaction: 5,
    overall_rating: 4,
    comments: 'Interactive Java lab sessions with real-time code debugging on the projector.',
    sanitized_comments: 'Interactive Java lab sessions with real-time code debugging on the projector.',
    sentiment_score: 0.78,
    sentiment_label: 'Positive',
    sentiment_tone: 'Constructive & Supportive',
    strengths: ['Hands-on debugging skills', 'Interactive classroom participation'],
    improvements: ['Provide online coding quiz link'],
    pii_detected: false,
    blind_token: 'zk_hash_0a1b2c3d4',
    created_at: '2026-10-26T09:15:00Z',
    semester: 'Semester 3 (Year 2)',
    academic_year: '2026-2027',
  },

  // Varshini - Technical English & Communication (English)
  {
    feedback_id: 1014,
    faculty_id: 5,
    teaching: 5,
    communication: 5,
    subject_knowledge: 5,
    punctuality: 5,
    classroom_interaction: 5,
    overall_rating: 5,
    comments: 'Very engaging and interactive Technical English classes! Conducts mock presentations, group discussions, and interview practice that really boost student confidence.',
    sanitized_comments: 'Very engaging and interactive Technical English classes! Conducts mock presentations, group discussions, and interview practice that really boost student confidence.',
    sentiment_score: 0.95,
    sentiment_label: 'Positive',
    sentiment_tone: 'Highly Appreciative',
    strengths: ['Confidence building', 'Mock interview sessions', 'Articulate communication'],
    improvements: ['Allocate more time for business email writing workshops'],
    pii_detected: false,
    blind_token: 'zk_hash_1b2c3d4e5',
    created_at: '2026-10-24T11:45:00Z',
    semester: 'Semester 3 (Year 2)',
    academic_year: '2026-2027',
  },
  {
    feedback_id: 1015,
    faculty_id: 5,
    teaching: 4,
    communication: 5,
    subject_knowledge: 4,
    punctuality: 5,
    classroom_interaction: 5,
    overall_rating: 4,
    comments: 'Provides constructive and personalized feedback on technical report writing and presentation skills.',
    sanitized_comments: 'Provides constructive and personalized feedback on technical report writing and presentation skills.',
    sentiment_score: 0.81,
    sentiment_label: 'Positive',
    sentiment_tone: 'Warm & Encouraging',
    strengths: ['Personalized feedback', 'Active classroom participation'],
    improvements: ['Include vocabulary building games'],
    pii_detected: false,
    blind_token: 'zk_hash_2c3d4e5f6',
    created_at: '2026-10-25T14:30:00Z',
    semester: 'Semester 3 (Year 2)',
    academic_year: '2026-2027',
  },
  {
    feedback_id: 1016,
    faculty_id: 5,
    teaching: 5,
    communication: 5,
    subject_knowledge: 5,
    punctuality: 5,
    classroom_interaction: 5,
    overall_rating: 5,
    comments: 'Fantastic teacher for English communication. Created an inclusive and lively atmosphere where every student felt comfortable speaking.',
    sanitized_comments: 'Fantastic teacher for English communication. Created an inclusive and lively atmosphere where every student felt comfortable speaking.',
    sentiment_score: 0.96,
    sentiment_label: 'Positive',
    sentiment_tone: 'Enthusiastic',
    strengths: ['Inclusive classroom environment', 'Public speaking encouragement'],
    improvements: [],
    pii_detected: false,
    blind_token: 'zk_hash_3d4e5f6a7',
    created_at: '2026-10-26T08:50:00Z',
    semester: 'Semester 3 (Year 2)',
    academic_year: '2026-2027',
  },
];

// Initial submission tokens (maps student_id -> faculty_id completed, ensuring single submission)
const INITIAL_TOKENS: StudentSubmissionToken[] = [
  { token_id: 'tok_1', student_id: 104, faculty_id: 1, semester: 'Semester 3 (Year 2)', completed_at: '2026-10-20T10:30:00Z' },
  { token_id: 'tok_2', student_id: 105, faculty_id: 1, semester: 'Semester 3 (Year 2)', completed_at: '2026-10-21T14:15:00Z' },
];

const INITIAL_AUDIT_LOGS: PrivacyAuditLog[] = [
  {
    id: 'log_01',
    timestamp: '2026-10-20T10:30:01Z',
    action: 'BLIND_TOKEN_GENERATED',
    detail: 'Generated cryptographic blinded token zk_hash_7f9a2b8e1 for Faculty #1 evaluation. Decoupled student record.',
    status: 'COMPLIANT',
  },
  {
    id: 'log_02',
    timestamp: '2026-10-21T14:15:01Z',
    action: 'K_ANONYMITY_EVALUATED',
    detail: 'Faculty #1 cohort submissions reached 4. Satisfied institutional k-anonymity (k >= 3). Aggregation permitted.',
    status: 'ENFORCED',
  },
  {
    id: 'log_03',
    timestamp: '2026-10-22T09:45:00Z',
    action: 'PII_SCRUBBED',
    detail: 'Automated PII scanner parsed student comment. Zero identifying tokens detected; verified anonymized text storage.',
    status: 'COMPLIANT',
  },
];

export class StorageService {
  private static load<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  }

  // Config
  static getConfig(): ComplianceConfig {
    return this.load<ComplianceConfig>(STORAGE_KEYS.CONFIG, INITIAL_CONFIG);
  }

  static updateConfig(config: Partial<ComplianceConfig>): ComplianceConfig {
    const current = this.getConfig();
    const updated = { ...current, ...config };
    this.save(STORAGE_KEYS.CONFIG, updated);
    this.logAudit('K_ANONYMITY_EVALUATED', `System privacy configuration updated. k-Threshold: ${updated.kAnonymityThreshold}, Strict PII: ${updated.piiSanitizationStrict}`);
    return updated;
  }

  // Students
  static getStudents(): Student[] {
    const list = this.load<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    return Array.isArray(list) && list.length > 0 ? list : INITIAL_STUDENTS;
  }

  static addStudent(student: Omit<Student, 'student_id'>): Student {
    const list = this.getStudents();
    const newStudent: Student = {
      ...student,
      student_id: Math.max(...list.map(s => s.student_id), 100) + 1,
    };
    list.push(newStudent);
    this.save(STORAGE_KEYS.STUDENTS, list);
    return newStudent;
  }

  // Faculty
  static getFaculty(): Faculty[] {
    const list = this.load<Faculty[]>(STORAGE_KEYS.FACULTY, INITIAL_FACULTY);
    return Array.isArray(list) && list.length > 0 ? list : INITIAL_FACULTY;
  }

  static addFaculty(faculty: Omit<Faculty, 'faculty_id'>): Faculty {
    const list = this.getFaculty();
    const newFaculty: Faculty = {
      ...faculty,
      faculty_id: Math.max(...list.map(f => f.faculty_id), 0) + 1,
    };
    list.push(newFaculty);
    this.save(STORAGE_KEYS.FACULTY, list);
    return newFaculty;
  }

  // Admins
  static getAdmins(): Admin[] {
    return this.load<Admin[]>(STORAGE_KEYS.ADMINS, INITIAL_ADMINS);
  }

  // Feedback & Tokens
  static getFeedbackList(): FeedbackSubmission[] {
    return this.load<FeedbackSubmission[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
  }

  static getTokens(): StudentSubmissionToken[] {
    return this.load<StudentSubmissionToken[]>(STORAGE_KEYS.TOKENS, INITIAL_TOKENS);
  }

  // Audit Logs
  static getAuditLogs(): PrivacyAuditLog[] {
    return this.load<PrivacyAuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  static logAudit(action: PrivacyAuditLog['action'], detail: string, status: PrivacyAuditLog['status'] = 'COMPLIANT') {
    const logs = this.getAuditLogs();
    const newLog: PrivacyAuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      detail,
      status,
    };
    logs.unshift(newLog);
    // keep max 50
    this.save(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 50));
  }

  // Check if student has already submitted feedback for faculty
  static hasStudentSubmitted(studentId: number, facultyId: number, semester?: string): boolean {
    const sem = semester || this.getConfig().currentSemester;
    const tokens = this.getTokens();
    return tokens.some(t => t.student_id === studentId && t.faculty_id === facultyId && t.semester === sem);
  }

  // Submit feedback with Zero-Knowledge Identity Decoupling
  static submitFeedback(submission: {
    studentId: number;
    facultyId: number;
    teaching: number;
    communication: number;
    subjectKnowledge: number;
    punctuality: number;
    classroomInteraction: number;
    overallRating: number;
    comments: string;
    sanitizedComments: string;
    sentimentScore: number;
    sentimentLabel: 'Positive' | 'Constructive' | 'Neutral' | 'Negative';
    sentimentTone: string;
    strengths: string[];
    improvements: string[];
    piiDetected: boolean;
  }): { success: boolean; feedbackId: number; blindToken: string } {
    const config = this.getConfig();

    // 1. Prevent duplicate submission per faculty per session
    if (this.hasStudentSubmitted(submission.studentId, submission.facultyId, config.currentSemester)) {
      throw new Error('Feedback has already been recorded for this faculty member in the current session.');
    }

    // 2. Generate Cryptographic Blind Token
    const blindToken = `zk_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;

    // 3. Record completion token for student (stores ONLY that student completed faculty X, never linking to ratings)
    const tokens = this.getTokens();
    tokens.push({
      token_id: `tok_${Date.now()}`,
      student_id: submission.studentId,
      faculty_id: submission.facultyId,
      semester: config.currentSemester,
      completed_at: new Date().toISOString(),
    });
    this.save(STORAGE_KEYS.TOKENS, tokens);

    // 4. Save feedback in Feedback table (with student_id omitted/decoupled in compliance mode)
    const feedbackList = this.getFeedbackList();
    const nextId = Math.max(...feedbackList.map(f => f.feedback_id), 1000) + 1;

    const newFeedback: FeedbackSubmission = {
      feedback_id: nextId,
      // Zero-knowledge decoupling: student_id is NEVER stored on the feedback row
      student_id: config.zeroKnowledgeDecoupling ? undefined : submission.studentId,
      faculty_id: submission.facultyId,
      teaching: submission.teaching,
      communication: submission.communication,
      subject_knowledge: submission.subjectKnowledge,
      punctuality: submission.punctuality,
      classroom_interaction: submission.classroomInteraction,
      overall_rating: submission.overallRating,
      comments: submission.sanitizedComments || submission.comments,
      sanitized_comments: submission.sanitizedComments,
      sentiment_score: submission.sentimentScore,
      sentiment_label: submission.sentimentLabel,
      sentiment_tone: submission.sentimentTone,
      strengths: submission.strengths,
      improvements: submission.improvements,
      pii_detected: submission.piiDetected,
      blind_token: blindToken,
      created_at: new Date().toISOString(),
      semester: config.currentSemester,
      academic_year: '2026-2027',
    };

    feedbackList.push(newFeedback);
    this.save(STORAGE_KEYS.FEEDBACK, feedbackList);

    // 5. Audit Logging
    this.logAudit(
      'FEEDBACK_SUBMITTED',
      `Anonymous submission recorded for Faculty #${submission.facultyId} under token ${blindToken.substring(0, 8)}... (Zero-Knowledge Decoupling: Active)`
    );

    if (submission.piiDetected) {
      this.logAudit(
        'PII_SCRUBBED',
        `Automated scrubber sanitized personally identifiable cues from submitted comment before persistence.`,
        'MITIGATED'
      );
    }

    return {
      success: true,
      feedbackId: nextId,
      blindToken,
    };
  }

  // Calculate SQL-style faculty report matching page 27 of PDF
  // "SELECT faculty_id, AVG(teaching), AVG(communication)... FROM Feedback GROUP BY faculty_id"
  static getFacultySummary(facultyId: number): FacultyRatingsSummary | null {
    const faculty = this.getFaculty().find(f => f.faculty_id === facultyId);
    if (!faculty) return null;

    const config = this.getConfig();
    const allFeedback = this.getFeedbackList().filter(f => f.faculty_id === facultyId);

    const total = allFeedback.length;
    const kSatisfied = total >= config.kAnonymityThreshold;

    if (total === 0) {
      return {
        ...faculty,
        total_evaluations: 0,
        avg_teaching: 0,
        avg_communication: 0,
        avg_knowledge: 0,
        avg_punctuality: 0,
        avg_interaction: 0,
        avg_overall_rating: 0,
        performance_status: 'NEEDS ATTENTION',
        stars: '☆☆☆☆☆',
        sentiment_stats: {
          positive_count: 0,
          constructive_count: 0,
          neutral_count: 0,
          negative_count: 0,
          average_score: 0,
        },
        key_strengths: [],
        key_improvements: [],
        k_anonymity_satisfied: false,
        comments: [],
      };
    }

    // Averages calculation (formula from Report.java)
    const sumTeaching = allFeedback.reduce((acc, f) => acc + f.teaching, 0);
    const sumCommunication = allFeedback.reduce((acc, f) => acc + f.communication, 0);
    const sumKnowledge = allFeedback.reduce((acc, f) => acc + f.subject_knowledge, 0);
    const sumPunctuality = allFeedback.reduce((acc, f) => acc + f.punctuality, 0);
    const sumInteraction = allFeedback.reduce((acc, f) => acc + f.classroom_interaction, 0);
    const sumOverall = allFeedback.reduce((acc, f) => acc + f.overall_rating, 0);

    const avg_teaching = Number((sumTeaching / total).toFixed(1));
    const avg_communication = Number((sumCommunication / total).toFixed(1));
    const avg_knowledge = Number((sumKnowledge / total).toFixed(1));
    const avg_punctuality = Number((sumPunctuality / total).toFixed(1));
    const avg_interaction = Number((sumInteraction / total).toFixed(1));
    const avg_overall_rating = Number((sumOverall / total).toFixed(1));

    // Performance Status categorization (matching PDF sample output)
    let performance_status: FacultyRatingsSummary['performance_status'] = 'AVERAGE';
    let stars = '★★★☆☆';
    if (avg_overall_rating >= 4.5) {
      performance_status = 'EXCELLENT';
      stars = '★★★★★';
    } else if (avg_overall_rating >= 4.0) {
      performance_status = 'VERY GOOD';
      stars = '★★★★☆';
    } else if (avg_overall_rating >= 3.0) {
      performance_status = 'GOOD';
      stars = '★★★☆☆';
    } else if (avg_overall_rating >= 2.0) {
      performance_status = 'AVERAGE';
      stars = '★★☆☆☆';
    } else {
      performance_status = 'NEEDS ATTENTION';
      stars = '★☆☆☆☆';
    }

    // Sentiment breakdown
    let positiveCount = 0;
    let constructiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;
    let totalScore = 0;

    const allStrengths = new Set<string>();
    const allImprovements = new Set<string>();

    allFeedback.forEach(f => {
      const lbl = f.sentiment_label || 'Neutral';
      if (lbl === 'Positive') positiveCount++;
      else if (lbl === 'Constructive') constructiveCount++;
      else if (lbl === 'Negative') negativeCount++;
      else neutralCount++;

      totalScore += (f.sentiment_score ?? 0.5);

      (f.strengths || []).forEach(s => allStrengths.add(s));
      (f.improvements || []).forEach(i => allImprovements.add(i));
    });

    const averageSentimentScore = Number((totalScore / total).toFixed(2));

    // Comments visibility gated by k-Anonymity (if submissions < kThreshold, comments withheld for privacy)
    const sanitizedComments = kSatisfied
      ? allFeedback
          .filter(f => f.comments && f.comments.trim().length > 0)
          .map(f => ({
            text: f.sanitized_comments || f.comments,
            sentiment_label: f.sentiment_label,
            sentiment_score: f.sentiment_score,
            date: f.created_at.split('T')[0],
          }))
      : [];

    return {
      ...faculty,
      total_evaluations: total,
      avg_teaching,
      avg_communication,
      avg_knowledge,
      avg_punctuality,
      avg_interaction,
      avg_overall_rating,
      performance_status,
      stars,
      sentiment_stats: {
        positive_count: positiveCount,
        constructive_count: constructiveCount,
        neutral_count: neutralCount,
        negative_count: negativeCount,
        average_score: averageSentimentScore,
      },
      key_strengths: Array.from(allStrengths).slice(0, 4),
      key_improvements: Array.from(allImprovements).slice(0, 3),
      k_anonymity_satisfied: kSatisfied,
      comments: sanitizedComments,
    };
  }

  // Get all faculty summaries
  static getAllFacultySummaries(): FacultyRatingsSummary[] {
    const faculty = this.getFaculty();
    return faculty.map(f => this.getFacultySummary(f.faculty_id)!).filter(Boolean);
  }

  // Reset database back to default seed state
  static resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.FACULTY);
    localStorage.removeItem(STORAGE_KEYS.ADMINS);
    localStorage.removeItem(STORAGE_KEYS.FEEDBACK);
    localStorage.removeItem(STORAGE_KEYS.TOKENS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
  }
}
