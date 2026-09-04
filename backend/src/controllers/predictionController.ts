import { Response } from 'express';
import { PredictionInput, PredictionResult, AuthRequest } from '../types';
import { mlService } from '../services/mlService';
import prisma from '../config/database';

export const runPrediction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const input: PredictionInput = req.body;

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
        },
        create: {
          userId,
          predictedGrade: result.predictedGrade,
          overallRisk: result.riskLevel,
          riskScore: result.confidence / 100,
          predictedConfidence: result.confidence,
          lastPredictedAt: new Date(),
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
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
