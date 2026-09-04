import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';

export const getFacultyDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const totalStudents = await prisma.user.count({ where: { role: 'student' } });
    const highRisk = await prisma.studentProfile.count({ where: { overallRisk: 'High' } });
    const mediumRisk = await prisma.studentProfile.count({ where: { overallRisk: 'Medium' } });
    const lowRisk = await prisma.studentProfile.count({ where: { overallRisk: 'Low' } });

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        lowRisk,
        mediumRisk,
        highRisk,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
};

export const getAllStudents = async (req: AuthRequest, res: Response) => {
  try {
    const { risk } = req.query;

    const students = await prisma.user.findMany({
      where: { role: 'student' },
      include: {
        studentProfile: {
          include: {
            weakSubjects: { include: { subject: true } },
            subjects: { include: { subject: true } },
          },
        },
        interventionLogs: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      take: 100,
    });

    const filtered = risk && risk !== 'all'
      ? students.filter(s => s.studentProfile?.overallRisk === risk)
      : students;

    const formatted = filtered.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      rollNumber: s.rollNumber,
      department: s.department,
      semester: s.semester,
      attendance: s.studentProfile?.attendance || 0,
      internalMarks: s.studentProfile?.internalMarks || 0,
      sgpa: s.studentProfile?.currentSGPA || 0,
      predictedGrade: s.studentProfile?.predictedGrade || 'N/A',
      risk: s.studentProfile?.overallRisk || 'Low',
      weakSubjects: s.studentProfile?.weakSubjects.map(w => w.subject.name) || [],
      interventionStatus: s.interventionLogs[0]?.status || 'not_started',
    }));

    return res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
};

export const getStudentDetail = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const student = await prisma.user.findUnique({
      where: { id },
      include: {
        studentProfile: {
          include: {
            weakSubjects: { include: { subject: true } },
            subjects: { include: { subject: true } },
          },
        },
        marksRecords: { include: { subject: true }, orderBy: { createdAt: 'desc' } },
        attendanceRecords: { include: { subject: true }, orderBy: { date: 'desc' } },
        interventionLogs: { orderBy: { createdAt: 'desc' } },
        predictions: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    return res.status(200).json({ success: true, data: student });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch student details' });
  }
};

export const updateStudentMarks = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { subjectId, type, score, maxScore, grade } = req.body;

    await prisma.marksRecord.create({
      data: {
        userId: id,
        subjectId,
        type,
        score,
        maxScore,
        grade,
      },
    });

    return res.status(200).json({ success: true, message: 'Marks updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update marks' });
  }
};

export const updateAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { subjectId, date, status } = req.body;

    await prisma.attendanceRecord.create({
      data: {
        userId: id,
        subjectId,
        date: new Date(date),
        status,
      },
    });

    return res.status(200).json({ success: true, message: 'Attendance updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update attendance' });
  }
};

export const getClassAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const subjects = await prisma.subject.findMany();
    const enrollments = await prisma.subjectEnrollment.findMany({
      include: { subject: true },
    });

    const analytics = subjects.map(sub => {
      const subEnrollments = enrollments.filter(e => e.subjectId === sub.id);
      const total = subEnrollments.length;
      const avgScore = total > 0
        ? subEnrollments.reduce((sum: number, e: any) => sum + (e.currentScore || 0), 0) / total
        : 0;
      const avgAttendance = total > 0
        ? subEnrollments.reduce((sum: number, e: any) => sum + (e.attendance || 0), 0) / total
        : 0;
      return {
        subjectId: sub.id,
        subjectName: sub.name,
        code: sub.code,
        totalStudents: total,
        averageScore: Math.round(avgScore),
        averageAttendance: Math.round(avgAttendance),
      };
    });

    return res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};

export const createAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { subjectId, title, description, dueDate, priority } = req.body;

    const assignment = await prisma.assignment.create({
      data: {
        userId: req.user!.id,
        subjectId,
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
        status: 'pending',
      },
    });

    return res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create assignment' });
  }
};

export const getAssignments = async (req: AuthRequest, res: Response) => {
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
