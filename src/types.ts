/**
 * Types adhering to the Teachers Feedback System database schema
 * and enterprise data privacy & security standards (FERPA / GDPR / k-Anonymity).
 */

export interface Student {
  student_id: number;
  student_name: string;
  department: string;
  year: number;
  email: string;
  password?: string;
  reg_no?: string;
}

export interface Faculty {
  faculty_id: number;
  faculty_name: string;
  department: string;
  subject: string;
  email: string;
  designation?: string;
  cabin?: string;
}

export interface Admin {
  admin_id: number;
  username: string;
  password?: string;
  role: 'Dean' | 'HOD' | 'Academic Coordinator';
}

export interface FeedbackSubmission {
  feedback_id: number;
  // Student ID is separated/decoupled in anonymous mode for cryptographic privacy
  student_id?: number; 
  faculty_id: number;
  teaching: number;
  communication: number;
  subject_knowledge: number;
  punctuality: number;
  classroom_interaction: number;
  overall_rating: number;
  comments: string;
  sanitized_comments?: string;
  sentiment_score?: number;
  sentiment_label?: 'Positive' | 'Constructive' | 'Neutral' | 'Negative';
  sentiment_tone?: string;
  strengths?: string[];
  improvements?: string[];
  pii_detected?: boolean;
  blind_token?: string;
  created_at: string;
  semester: string;
  academic_year: string;
}

// Student Completion Record (Token table preventing duplicate submissions without linking to ratings)
export interface StudentSubmissionToken {
  token_id: string;
  student_id: number;
  faculty_id: number;
  semester: string;
  completed_at: string;
}

export interface FacultyRatingsSummary {
  faculty_id: number;
  faculty_name: string;
  department: string;
  subject: string;
  email: string;
  designation?: string;
  cabin?: string;
  total_evaluations: number;
  avg_teaching: number;
  avg_communication: number;
  avg_knowledge: number;
  avg_punctuality: number;
  avg_interaction: number;
  avg_overall_rating: number;
  performance_status: 'EXCELLENT' | 'VERY GOOD' | 'GOOD' | 'AVERAGE' | 'NEEDS ATTENTION';
  stars: string;
  sentiment_stats: {
    positive_count: number;
    constructive_count: number;
    neutral_count: number;
    negative_count: number;
    average_score: number;
  };
  key_strengths: string[];
  key_improvements: string[];
  ai_summary?: string;
  k_anonymity_satisfied: boolean;
  comments: {
    text: string;
    sentiment_label?: string;
    sentiment_score?: number;
    date: string;
  }[];
}

export interface PrivacyAuditLog {
  id: string;
  timestamp: string;
  action: 'FEEDBACK_SUBMITTED' | 'PII_SCRUBBED' | 'K_ANONYMITY_EVALUATED' | 'BLIND_TOKEN_GENERATED' | 'REPORT_EXPORTED';
  detail: string;
  status: 'COMPLIANT' | 'MITIGATED' | 'ENFORCED';
}

export interface ComplianceConfig {
  kAnonymityThreshold: number; // e.g., 3
  piiSanitizationStrict: boolean;
  zeroKnowledgeDecoupling: boolean;
  differentialPrivacyNoise: boolean;
  currentSemester: string;
  feedbackSessionOpen: boolean;
}
