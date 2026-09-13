import { Request } from 'express';

export type Role = 'student' | 'faculty' | 'admin';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
    isOnboarded?: boolean;
    streak?: number;
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

export interface VideoResult {
  title: string;
  link: string;
  channel: string;
  thumbnail: string;
  views: string;
  duration: string;
}

export interface RecoveryPlan {
  predictedGrade: string;
  riskLevel: string;
  confidence: number;
  weakSubjects: string[];
  recommendations: Array<{
    step: string;
    desc: string;
    status: 'done' | 'in_progress' | 'pending';
  }>;
  videoRecommendations: Array<VideoResult & { isTopPick: boolean }>;
}
