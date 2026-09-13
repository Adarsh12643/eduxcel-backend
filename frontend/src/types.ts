export type Role = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  isOnboarded?: boolean;
}

export interface SubjectPerformance {
  subject: string;
  currentScore: number;
  predictedScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  attendance: number;
}

export interface StudentStats {
  overallPerformance: number;
  predictedGrade: string;
  academicRisk: 'Low' | 'Medium' | 'High';
  attendance: number;
  currentSGPA: number;
  targetSGPA?: number;
}
