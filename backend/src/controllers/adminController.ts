import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';

export const getAdminOverview = async (req: AuthRequest, res: Response) => {
  try {
    const totalStudents = await prisma.user.count({ where: { role: 'student' } });
    const totalFaculty = await prisma.user.count({ where: { role: 'faculty' } });
    const totalSubjects = await prisma.subject.count();
    const totalPredictions = await prisma.prediction.count();

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalFaculty,
        totalSubjects,
        totalPredictions,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch overview' });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {  // eslint-disable-line
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        isActive: true,
        createdAt: true,
      },
    });

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const getSystemStats = async (req: AuthRequest, res: Response) => {  // eslint-disable-line
  try {
    const stats = {
      totalUsers: await prisma.user.count(),
      activeUsers: await prisma.user.count({ where: { isActive: true } }),
      totalPredictions: await prisma.prediction.count(),
      totalAssignments: await prisma.assignment.count(),
      totalMarksRecords: await prisma.marksRecord.count(),
      totalAttendanceRecords: await prisma.attendanceRecord.count(),
    };

    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};
