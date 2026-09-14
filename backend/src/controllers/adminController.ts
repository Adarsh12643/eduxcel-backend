import { Response } from 'express';
import prisma from '../config/database';
import User from '../models/User';
import { AuthRequest } from '../types';

export const getAdminOverview = async (req: AuthRequest, res: Response) => {
  try {
    const totalStudents = await prisma.user.count({ where: { role: 'student' } });
    const totalFaculty = await prisma.user.count({ where: { role: 'faculty' } });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
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
    const users = await User.find({}, {
      _id: 1,
      email: 1,
      name: 1,
      role: 1,
      department: 1,
      isActive: 1,
      createdAt: 1,
    }).lean();

    return res.status(200).json({ success: true, data: users });
    const formattedUsers = users.map(u => ({ ...u, id: u._id }));

    return res.status(200).json({ success: true, data: formattedUsers });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const getSystemStats = async (req: AuthRequest, res: Response) => {  // eslint-disable-line
export const getSystemStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalAttendanceRecords = await prisma.attendanceRecord.count();
    const presentAttendanceRecords = await prisma.attendanceRecord.count({ where: { status: 'present' } });
    const overallAttendance = totalAttendanceRecords > 0 ? Math.round((presentAttendanceRecords / totalAttendanceRecords) * 100) : 0;

    const riskLevels = await prisma.prediction.groupBy({
      by: ['riskLevel'],
      _count: { riskLevel: true },
    });

    const riskDistribution = {
      Low: 0,
      Medium: 0,
      High: 0,
    };
    riskLevels.forEach((r) => {
      if (r.riskLevel === 'Low') riskDistribution.Low = r._count.riskLevel;
      if (r.riskLevel === 'Medium') riskDistribution.Medium = r._count.riskLevel;
      if (r.riskLevel === 'High') riskDistribution.High = r._count.riskLevel;
    });

    const stats = {
      totalUsers: await prisma.user.count(),
      activeUsers: await prisma.user.count({ where: { isActive: true } }),
      totalUsers: await User.countDocuments(),
      activeUsers: await User.countDocuments({ isActive: true }),
      totalPredictions: await prisma.prediction.count(),
      totalAssignments: await prisma.assignment.count(),
      totalMarksRecords: await prisma.marksRecord.count(),
      totalAttendanceRecords: await prisma.attendanceRecord.count(),
      totalAttendanceRecords,
      overallAttendance,
      riskDistribution,
    };

    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};
