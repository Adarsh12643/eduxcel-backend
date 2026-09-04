import { Request } from 'express';

export type Role = 'student' | 'faculty' | 'admin';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export interface PredictionInput {
  userId?: string;
  attendance: number;
  internalMarks: number;
  previousSGPA: number;
  assignmentCompletion: number;
  subjectPerformance: Record<string, number>;
  semester: number;
}

export interface PredictionResult {
  predictedGrade: string;
  riskLevel: string;
  confidence: number;
  factors: Array<{ factor: string; impact: string; value: number; contribution?: number }>;
  weakSubjects: string[];
  recommendations: string[];
}
