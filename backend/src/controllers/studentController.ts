import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';

export const getStudentDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        subjects: {
          include: { subject: true },
        },
        weakSubjects: {
          include: { subject: true },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where: { userId },
      select: { status: true },
    });

    const totalClasses = attendanceRecords.length;
    const presentClasses = attendanceRecords.filter(r => r.status === 'present').length;
    const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

    const assignments = await prisma.assignment.findMany({
      where: { userId, status: { not: 'graded' } },
    });

    const completedAssignments = await prisma.assignment.count({
      where: { userId, status: 'graded' },
    });
    const totalAssignments = await prisma.assignment.count({ where: { userId } });
    const assignmentCompletion = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

    return res.status(200).json({
      success: true,
      data: {
        overallPerformance: profile.currentSGPA ? profile.currentSGPA * 10 : 0,
        predictedGrade: profile.predictedGrade || 'N/A',
        academicRisk: profile.overallRisk || 'Low',
        attendance: attendancePercentage || profile.attendance || 0,
        currentSGPA: profile.currentSGPA || 0,
        targetSGPA: profile.targetSGPA || 0,
        assignmentCompletion,
        subjects: profile.subjects,
        weakSubjects: profile.weakSubjects,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
};

export const getStudentSubjects = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user!.id },
      include: {
        subjects: {
          include: { subject: true },
        },
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
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user!.id },
      include: {
        weakSubjects: { include: { subject: true } },
        subjects: { include: { subject: true } },
      },
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const plan = {
      weakSubjects: profile.weakSubjects,
      recommendations: [
        { title: 'Improve Attendance', desc: 'Attend next 5 classes for weak subjects', status: 'pending' },
        { title: 'Complete Weak Subject Modules', desc: 'Focus on foundational concepts', status: 'active' },
        { title: 'Practice Assignments', desc: 'Complete pending assignments', status: 'pending' },
        { title: 'AI Tutoring Sessions', desc: 'Ask AI assistant for topic clarifications', status: 'pending' },
        { title: 'Take Practice Quizzes', desc: 'Test knowledge before exams', status: 'pending' },
      ],
    };

    return res.status(200).json({ success: true, data: plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch recovery plan' });
  }
};
