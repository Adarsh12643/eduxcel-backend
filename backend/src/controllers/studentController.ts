import { Response } from 'express';
import prisma from '../config/database';
import User from '../models/User';
import { AuthRequest } from '../types';
import { mlService } from '../services/mlService';

export const getStudentDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await User.findById(userId);

    let profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        subjects: { include: { subject: true } },
        weakSubjects: { include: { subject: true } },
      },
    });

    let attendancePercentage = 0;
    let assignmentCompletion = 0;

    try {
      const attendanceRecords = await prisma.attendanceRecord.findMany({
        where: { userId },
        select: { status: true },
      });
      const totalClasses = attendanceRecords.length;
      const presentClasses = attendanceRecords.filter((r) => r.status === 'present').length;
      attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : (profile?.attendance || 0);
    } catch {
      attendancePercentage = profile?.attendance || 0;
    }

    try {
      const totalAssignments = await prisma.assignment.count({ where: { userId } });
      const completedAssignments = await prisma.assignment.count({ where: { userId, status: 'graded' } });
      assignmentCompletion = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : (profile?.assignmentCompletion || 0);
    } catch {
      assignmentCompletion = profile?.assignmentCompletion || 0;
    }

    let predictionData = null;
    try {
      predictionData = await mlService.predict({
        userId,
        attendance: attendancePercentage,
        internalMarks: profile?.internalMarks || 60,
        previousSGPA: profile?.previousSGPA || profile?.currentSGPA || 6.0,
        assignmentCompletion,
        subjectPerformance: profile?.subjects.reduce((acc: Record<string, number>, s: any) => {
          acc[s.subject.name] = s.currentScore || 50;
          return acc;
        }, {}) || {},
        semester: profile?.semester || 6,
      });
    } catch {
      predictionData = null;
    }

    const latestPrediction = await prisma.prediction.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    let riskData: { level: string; score: number } | null = null;
    if (latestPrediction) {
      riskData = { level: latestPrediction.riskLevel, score: latestPrediction.confidence / 100 };
    }

    return res.status(200).json({
      success: true,
      data: {
        overallPerformance: profile?.currentSGPA ? profile.currentSGPA * 10 : (predictionData ? Math.round(predictionData.confidence) : 0),
        predictedGrade: profile?.predictedGrade || predictionData?.predictedGrade || 'N/A',
        academicRisk: profile?.overallRisk || predictionData?.riskLevel || 'Low',
        riskScore: riskData?.score || 0,
        attendance: attendancePercentage,
        currentSGPA: profile?.currentSGPA || 0,
        targetSGPA: profile?.targetSGPA || user?.targetSGPA || 8.0,
        assignmentCompletion,
        internalMarks: profile?.internalMarks || 0,
        studyHours: user?.studyHours || 0,
        learningStyle: user?.learningStyle || 'visual',
        weakSubjects: profile?.weakSubjects.map((w) => w.subject.name) || user?.weakSubjects || [],
        recommendations: predictionData?.recommendations || [],
        factors: predictionData?.factors || [],
        confidence: predictionData?.confidence || 0,
        subjects: profile?.subjects.map((s) => ({
          id: s.id,
          name: s.subject.name,
          code: s.subject.code,
          credits: s.subject.credits,
          currentScore: s.currentScore || 0,
          predictedScore: s.predictedScore || 0,
          attendance: s.attendance || 0,
          riskLevel: s.riskLevel || 'Low',
        })) || [],
      },
    });
  } catch (error: any) {
    console.error('Student dashboard error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
};

export const getStudentSubjects = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user!.id },
      include: {
        subjects: { include: { subject: true } },
      },
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    return res.status(200).json({ success: true, data: profile.subjects });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch subjects' });
  }
};

export const getStudentAssignments = async (req: AuthRequest, res: Response) => {
  try {
    const assignments = await prisma.assignment.findMany({
      where: { userId: req.user!.id },
      include: { subject: true },
      orderBy: { dueDate: 'asc' },
    });

    return res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch assignments' });
  }
};

export const getStudentHistory = async (req: AuthRequest, res: Response) => {
  try {
    const marks = await prisma.marksRecord.findMany({
      where: { userId: req.user!.id },
      include: { subject: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ success: true, data: marks });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch history' });
  }
};

export const getRecoveryPlan = async (req: AuthRequest, res: Response) => {
  try {
    const plan = await mlService.getRecoveryPlan(req.user!.id);
    return res.status(200).json({ success: true, data: plan });
  } catch (error: any) {
    console.error('Recovery plan error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch recovery plan' });
  }
};
