import { Response } from 'express';
import { PredictionInput, PredictionResult, AuthRequest, RecoveryPlan } from '../types';
import { mlService } from '../services/mlService';
import prisma from '../config/database';
import User from '../models/User';

export const runPrediction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        subjects: { include: { subject: true } },
        weakSubjects: { include: { subject: true } },
      },
    });

    let subjectPerformance: Record<string, number> = {};
    let attendance = 70;
    let internalMarks = 60;
    let assignmentCompletion = 50;
    let previousSGPA = studentProfile?.previousSGPA || studentProfile?.currentSGPA || 6.0;
    let semester = studentProfile ? 6 : 1;

    if (studentProfile) {
      attendance = studentProfile.attendance || 70;
      internalMarks = studentProfile.internalMarks || 60;
      assignmentCompletion = studentProfile.assignmentCompletion || 50;
      previousSGPA = studentProfile.previousSGPA || studentProfile.currentSGPA || 6.0;

      for (const subj of studentProfile.subjects) {
        subjectPerformance[subj.subject.name] = subj.currentScore || 50;
      }
    }

    if (user.studyHours !== undefined) {
      subjectPerformance['_studyHours'] = user.studyHours;
    }
    if (user.weakSubjects && user.weakSubjects.length > 0) {
      for (const ws of user.weakSubjects) {
        if (!(ws in subjectPerformance)) {
          subjectPerformance[ws] = 40;
        }
      }
    }

    if (Object.keys(subjectPerformance).length === 0) {
      subjectPerformance = { 'General Studies': 50 };
    }

    const input: PredictionInput = {
      userId,
      attendance,
      internalMarks,
      previousSGPA,
      assignmentCompletion,
      subjectPerformance,
      semester,
    };

    const result = await mlService.predict(input);

    await prisma.prediction.create({
      data: {
        userId,
        predictedGrade: result.predictedGrade,
        riskLevel: result.riskLevel,
        confidence: result.confidence,
        factors: JSON.stringify(result.factors),
        weakSubjects: JSON.stringify(result.weakSubjects),
        recommendations: JSON.stringify(result.recommendations),
        modelVersion: 'v1.0',
        inputData: JSON.stringify(input),
      },
    });

    if (userId) {
      await prisma.studentProfile.upsert({
        where: { userId },
        update: {
          predictedGrade: result.predictedGrade,
          overallRisk: result.riskLevel,
          riskScore: result.confidence / 100,
          predictedConfidence: result.confidence,
          lastPredictedAt: new Date(),
          currentSGPA: previousSGPA,
          previousSGPA: previousSGPA,
          attendance,
          internalMarks,
          assignmentCompletion,
        },
        create: {
          userId,
          predictedGrade: result.predictedGrade,
          overallRisk: result.riskLevel,
          riskScore: result.confidence / 100,
          predictedConfidence: result.confidence,
          lastPredictedAt: new Date(),
          currentSGPA: previousSGPA,
          previousSGPA: previousSGPA,
          attendance,
          internalMarks,
          assignmentCompletion,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Prediction error:', error);
    return res.status(500).json({ success: false, message: 'Prediction failed' });
  }
};

export const getStudentPredictions = async (req: AuthRequest, res: Response) => {
  try {
    const predictions = await prisma.prediction.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return res.status(200).json({ success: true, data: predictions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch predictions' });
  }
};

export const whatIfSimulation = async (req: AuthRequest, res: Response) => {
  try {
    const input: PredictionInput = req.body;
    const result = await mlService.simulateWhatIf(input);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Simulation failed' });
  }
};

export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { subjects } = req.body;

    const resolvedSubjects = subjects && Array.isArray(subjects) && subjects.length > 0
      ? subjects
      : [];

    const plan = await mlService.getRecoveryPlan(userId, resolvedSubjects);
    return res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    return res.status(500).json({ success: false, message: 'Recommendation failed' });
  }
};

export const getStudentRecoveryPlan = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const plan: RecoveryPlan = await mlService.getRecoveryPlan(userId);
    return res.status(200).json({ success: true, data: plan });
  } catch (error) {
    console.error('Recovery plan error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch recovery plan' });
  }
};
