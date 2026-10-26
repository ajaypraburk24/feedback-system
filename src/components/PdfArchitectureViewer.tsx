import React, { useState } from 'react';
import { 
  FileCode2, 
  Database, 
  Terminal, 
  Copy, 
  Check, 
  BookOpen, 
  CheckCircle2,
  Code2,
  Layers
} from 'lucide-react';

export const PdfArchitectureViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<'sql' | 'connection' | 'feedback' | 'report' | 'main'>('sql');
  const [copied, setCopied] = useState(false);

  const files = {
    sql: {
      name: 'DATABASE.SQL',
      language: 'sql',
      page: 'PDF Pages 20-22',
      content: `-- ==========================================
-- TEACHERS FEEDBACK SYSTEM
-- DATABASE CREATION SCRIPT (DATABASE.SQL)
-- ==========================================

CREATE DATABASE TeachersFeedbackSystem;
USE TeachersFeedbackSystem;

-- ==========================
-- STUDENT TABLE
-- ==========================
CREATE TABLE Student (
  student_id INT PRIMARY KEY AUTO_INCREMENT,
  student_name VARCHAR(100) NOT NULL,
  department VARCHAR(50),
  year INT,
  email VARCHAR(100),
  password VARCHAR(100)
);

-- ==========================
-- FACULTY TABLE
-- ==========================
CREATE TABLE Faculty (
  faculty_id INT PRIMARY KEY AUTO_INCREMENT,
  faculty_name VARCHAR(100) NOT NULL,
  department VARCHAR(50),
  subject VARCHAR(100),
  email VARCHAR(100)
);

-- ==========================
-- ADMIN TABLE
-- ==========================
CREATE TABLE Admin (
  admin_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50),
  password VARCHAR(100)
);

-- ==========================
-- FEEDBACK TABLE (6 Parameters)
-- ==========================
CREATE TABLE Feedback (
  feedback_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT,
  faculty_id INT,
  teaching INT,
  communication INT,
  subject_knowledge INT,
  punctuality INT,
  classroom_interaction INT,
  overall_rating INT,
  FOREIGN KEY(student_id) REFERENCES Student(student_id),
  FOREIGN KEY(faculty_id) REFERENCES Faculty(faculty_id)
);`,
    },
    connection: {
      name: 'DBConnection.java',
      language: 'java',
      page: 'PDF Pages 22-23',
      content: `// ==========================================
// JAVA DATABASE CONNECTION (DBCONNECTION.JAVA)
// ==========================================

import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {
    private static final String URL =
        "jdbc:mysql://localhost:3306/TeachersFeedbackSystem";
    private static final String USER = "root";
    private static final String PASSWORD = "";

    public static Connection getConnection() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}`,
    },
    feedback: {
      name: 'Feedback.java',
      language: 'java',
      page: 'PDF Pages 23-26',
      content: `// ==========================================
// FEEDBACK SUBMISSION MODULE (FEEDBACK.JAVA)
// ==========================================

import java.sql.Connection;
import java.sql.PreparedStatement;

public class Feedback {
    public static void submitFeedback(
        int studentId,
        int facultyId,
        int teaching,
        int communication,
        int subjectKnowledge,
        int punctuality,
        int classroomInteraction,
        int overallRating) {

        try {
            Connection con = DBConnection.getConnection();
            String sql =
                "INSERT INTO Feedback(student_id, faculty_id, teaching, " +
                "communication, subject_knowledge, punctuality, " +
                "classroom_interaction, overall_rating) VALUES(?,?,?,?,?,?,?,?)";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, studentId);
            ps.setInt(2, facultyId);
            ps.setInt(3, teaching);
            ps.setInt(4, communication);
            ps.setInt(5, subjectKnowledge);
            ps.setInt(6, punctuality);
            ps.setInt(7, classroomInteraction);
            ps.setInt(8, overallRating);

            ps.executeUpdate();
            System.out.println("Feedback Submitted Successfully");
            con.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}`,
    },
    report: {
      name: 'Report.java',
      language: 'java',
      page: 'PDF Pages 26-28',
      content: `// ==========================================
// REPORT GENERATION MODULE (REPORT.JAVA)
// ==========================================

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class Report {
    public static void generateReport() {
        try {
            Connection con = DBConnection.getConnection();
            Statement st = con.createStatement();

            String sql =
                "SELECT faculty_id," +
                "AVG(teaching) AS Teaching," +
                "AVG(communication) AS Communication," +
                "AVG(subject_knowledge) AS Knowledge," +
                "AVG(punctuality) AS Punctuality," +
                "AVG(classroom_interaction) AS Interaction," +
                "AVG(overall_rating) AS OverallRating " +
                "FROM Feedback GROUP BY faculty_id";

            ResultSet rs = st.executeQuery(sql);

            while (rs.next()) {
                System.out.println("-------------------------------------");
                System.out.println("Faculty ID : " + rs.getInt("faculty_id"));
                System.out.println("Teaching : " + rs.getDouble("Teaching"));
                System.out.println("Communication : " + rs.getDouble("Communication"));
                System.out.println("Knowledge : " + rs.getDouble("Knowledge"));
                System.out.println("Punctuality : " + rs.getDouble("Punctuality"));
                System.out.println("Interaction : " + rs.getDouble("Interaction"));
                System.out.println("Overall Rating : " + rs.getDouble("OverallRating"));
            }
            con.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}`,
    },
    main: {
      name: 'Main.java',
      language: 'java',
      page: 'PDF Page 28',
      content: `// ==========================================
// MAIN CLASS (MAIN.JAVA)
// ==========================================

public class Main {
    public static void main(String[] args) {
        // Sample Feedback submission (matching student 1, faculty 1, scores 5,4,5,5,4,5)
        Feedback.submitFeedback(
            1, // studentId
            1, // facultyId
            5, // teaching
            4, // communication
            5, // subjectKnowledge
            5, // punctuality
            4, // classroomInteraction
            5  // overallRating
        );

        // Generate and display faculty evaluation report
        Report.generateReport();
    }
}`,
    },
  };

  const currentFile = files[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
              Chapter 8 Source Code Documentation
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
              Java SE 17 + MySQL + JDBC
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Project Code Architecture from PDF</h1>
          <p className="text-xs text-slate-400">
            Aditya Krishnan A (814725148003) • Ajay Prabu R K (814725148004) • Venkatesh R P (814725148062)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Code Browser */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* File tabs */}
        <div className="flex items-center gap-1 bg-slate-950 px-4 py-2 border-b border-slate-800 overflow-x-auto text-xs font-mono">
          {(Object.keys(files) as Array<keyof typeof files>).map((k) => (
            <button
              key={k}
              onClick={() => setSelectedFile(k)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
                selectedFile === k
                  ? 'bg-slate-800 text-purple-300 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              <span>{files[k].name}</span>
            </button>
          ))}
        </div>

        {/* File details bar */}
        <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Source: {currentFile.page}</span>
          <span className="text-purple-400 uppercase">{currentFile.language}</span>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-slate-950 overflow-x-auto">
          <pre className="font-mono text-xs text-slate-200 leading-relaxed">
            <code>{currentFile.content}</code>
          </pre>
        </div>
      </div>

      {/* How our Prototype Elevates the PDF Code */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Prototype Modernization &amp; Security Enhancements
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-cyan-400">1. Real-Time NLP Sentiment</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Directly fulfills Chapter 11 (Future Enhancement) by adding real-time sentiment analysis, emotional tone scoring, and pedagogical strength extraction on top of the 6 core criteria.
            </p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-400">2. Zero-Knowledge Decoupling</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Eliminates the privacy risk in traditional <code className="text-slate-300">Feedback.student_id</code> foreign key by storing cryptographic blind tokens, mathematically guaranteeing anonymity for students.
            </p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-amber-400">3. k-Anonymity &amp; PII Sanitizer</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Prevents small class re-identification attacks and actively scrubs student names, roll numbers, and seating clues from comment fields before faculty display.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
