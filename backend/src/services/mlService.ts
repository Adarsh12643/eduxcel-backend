import { PredictionInput, PredictionResult, RecoveryPlan, VideoResult } from '../types';
import prisma from '../config/database';
import User from '../models/User';

export class MLService {
  private mlServiceUrl: string;

  constructor() {
    this.mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
  }

  async predict(input: PredictionInput): Promise<PredictionResult> {
    try {
      const response = await fetch(`${this.mlServiceUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error('ML service unavailable');
      }

      const data = await response.json() as PredictionResult;
      return data;
    } catch (error) {
      console.warn('ML service unavailable, using fallback prediction');
      return this.fallbackPredict(input);
    }
  }

  async simulateWhatIf(input: PredictionInput): Promise<PredictionResult> {
    try {
      const response = await fetch(`${this.mlServiceUrl}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error('ML service unavailable');
      }

      return await response.json() as PredictionResult;
    } catch (error) {
      console.warn('ML service unavailable, using fallback simulation');
      return this.fallbackPredict(input);
    }
  }

  async getYouTubeRecommendations(subjects: string[]): Promise<any[]> {
    if (!subjects || subjects.length === 0) return [];
    try {
      const response = await fetch(`${this.mlServiceUrl}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjects }),
      });

      if (!response.ok) {
        throw new Error('ML recommend service unavailable');
      }

      const result = await response.json();
      if (result.videos) return result.videos;
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.warn('YouTube recommend service unavailable, returning empty recommendations');
      return [];
    }
  }

  async getRecoveryPlan(userId: string, forcedSubjects?: string[]): Promise<RecoveryPlan> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
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
    let previousSGPA = 6.0;
    let semester = 1;

    if (studentProfile) {
      attendance = studentProfile.attendance || 70;
      internalMarks = studentProfile.internalMarks || 60;
      assignmentCompletion = studentProfile.assignmentCompletion || 50;
      previousSGPA = studentProfile.previousSGPA || studentProfile.currentSGPA || 6.0;
      semester = studentProfile.semester || 6;

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

    const targets = forcedSubjects && forcedSubjects.length > 0
      ? forcedSubjects
      : user.weakSubjects && user.weakSubjects.length > 0
        ? user.weakSubjects
        : Object.keys(subjectPerformance).filter((k) => subjectPerformance[k] < 60 && !k.startsWith('_'));

    const payload = {
      subjects: targets,
      userId,
      subjectPerformance,
      attendance,
      internalMarks,
      previousSGPA,
      assignmentCompletion,
      semester,
      studyHours: user.studyHours,
      learningStyle: user.learningStyle,
    };

    try {
      const response = await fetch(`${this.mlServiceUrl}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const prediction = data.prediction || data;
        const videos: any[] = (data.videos || []).map((v: any, i: number) => ({
          title: v.title || '',
          link: v.link || '',
          channel: v.channel || '',
          channelId: v.channelId || '',
          thumbnail: v.thumbnail || '',
          views: v.views || '',
          duration: v.duration || '',
          isTopPick: v.isTopPick || i === 0,
        }));

        const recommendations = (prediction.recommendations || []).map((rec: string, idx: number) => {
          const statuses: Array<'done' | 'in_progress' | 'pending'> = ['done', 'in_progress', 'pending', 'pending', 'pending'];
          return {
            step: rec,
            desc: this.getRecommendationDescription(rec, prediction.weakSubjects || []),
            status: idx < statuses.length ? statuses[idx] : 'pending',
          };
        });

        if (recommendations.length === 0) {
          recommendations.push({
            step: 'Review weak areas',
            desc: 'Focus on subjects where scores are below 60%.',
            status: 'in_progress' as const,
          });
        }

        return {
          predictedGrade: prediction.predictedGrade || 'N/A',
          riskLevel: prediction.riskLevel || 'Low',
          confidence: prediction.confidence || 0,
          weakSubjects: prediction.weakSubjects || [],
          recommendations,
          videoRecommendations: videos,
        } as RecoveryPlan;
      }
    } catch (error) {
      console.warn('ML /recommend endpoint unavailable, using local fallback');
    }

    const prediction = await this.predict({
      userId,
      attendance,
      internalMarks,
      previousSGPA,
      assignmentCompletion,
      subjectPerformance,
      semester,
    });

    const videos: VideoResult[] = [];
    if (targets.length > 0) {
      const ytVideos = await this.getYouTubeRecommendations(targets);
      for (let i = 0; i < ytVideos.length; i++) {
        videos.push({
          title: ytVideos[i].title || '',
          link: ytVideos[i].link || '',
          channel: ytVideos[i].channel || '',
          channelId: ytVideos[i].channelId || '',
          thumbnail: ytVideos[i].thumbnail || '',
          views: ytVideos[i].views || '',
          duration: ytVideos[i].duration || '',
          isTopPick: i === 0,
        });
      }
    }

    const recommendations = (prediction.recommendations || []).map((rec, idx) => {
      const statuses: Array<'done' | 'in_progress' | 'pending'> = ['done', 'in_progress', 'pending', 'pending', 'pending'];
      return {
        step: rec,
        desc: this.getRecommendationDescription(rec, prediction.weakSubjects),
        status: idx < statuses.length ? statuses[idx] : 'pending',
      };
    });

    if (recommendations.length === 0) {
      recommendations.push({
        step: 'Review weak areas',
        desc: 'Focus on subjects where scores are below 60%.',
        status: 'in_progress' as const,
      });
    }

    return {
      predictedGrade: prediction.predictedGrade,
      riskLevel: prediction.riskLevel,
      confidence: prediction.confidence,
      weakSubjects: prediction.weakSubjects,
      recommendations,
      videoRecommendations: videos,
    };
  }

  private getRecommendationDescription(rec: string, weakSubjects: string[]): string {
    if (weakSubjects.length > 0) {
      const matched = weakSubjects.find((ws) => rec.toLowerCase().includes(ws.toLowerCase()));
      if (matched) {
        return `Targeted action for ${matched}.`;
      }
    }
    if (rec.toLowerCase().includes('attendance')) {
      return 'Raise your attendance above the 75% threshold.';
    }
    if (rec.toLowerCase().includes('assignment')) {
      return 'Clear your pending assignment queue to improve completion rate.';
    }
    if (rec.toLowerCase().includes('practice')) {
      return 'Reinforce foundational concepts with targeted exercises.';
    }
    return 'Follow the AI-guided roadmap to improve your metrics.';
  }

  private fallbackPredict(input: PredictionInput): PredictionResult {
    const { attendance, internalMarks, previousSGPA, assignmentCompletion, subjectPerformance } = input;

    const attendanceScore = attendance / 100;
    const marksScore = internalMarks / 100;
    const sgpaScore = previousSGPA / 10;
    const assignmentScore = assignmentCompletion / 100;

    const subjectScores = Object.entries(subjectPerformance).filter(([k]) => !k.startsWith('_'));
    const subjectAvg = subjectScores.length > 0
      ? subjectScores.reduce((acc, [, v]) => acc + v, 0) / subjectScores.length / 100
      : 0.5;

    const overallScore =
      attendanceScore * 0.3 +
      marksScore * 0.3 +
      sgpaScore * 0.2 +
      assignmentScore * 0.1 +
      subjectAvg * 0.1;

    const confidence = Math.min(95, Math.max(60, Math.round(overallScore * 100)));
    const weakSubjects = Object.entries(subjectPerformance)
      .filter(([k, v]) => !k.startsWith('_') && v < 60)
      .map(([subject]) => subject);

    const riskLevel = overallScore >= 0.7 ? 'Low' : overallScore >= 0.5 ? 'Medium' : 'High';

    const gradeMap: Record<number, string> = {
      10: 'A+', 9: 'A', 8: 'B+', 7: 'B', 6: 'C+', 5: 'C', 4: 'D', 0: 'F',
    };
    const gradeIndex = Math.floor(overallScore * 10);
    const predictedGrade = gradeMap[Math.min(gradeIndex, 10)] || 'C';

    const factors = [
      { factor: 'Attendance', impact: attendanceScore < 0.7 ? 'Critical Negative' : 'Positive', value: Math.round(attendanceScore * 100), contribution: attendanceScore * 0.3 },
      { factor: 'Internal Marks', impact: marksScore < 0.7 ? 'High Negative' : 'Positive', value: Math.round(marksScore * 100), contribution: marksScore * 0.3 },
      { factor: 'Previous SGPA', impact: sgpaScore < 0.7 ? 'Moderate Negative' : 'Positive', value: Math.round(sgpaScore * 100), contribution: sgpaScore * 0.2 },
      { factor: 'Assignment Completion', impact: assignmentScore < 0.7 ? 'High Negative' : 'Positive', value: Math.round(assignmentScore * 100), contribution: assignmentScore * 0.1 },
    ];

    const recommendations = [
      ...weakSubjects.map((s) => `Focus on improving ${s} through targeted practice`),
      'Attend all classes regularly',
      'Complete pending assignments',
      'Schedule weekly review sessions',
    ];

    return {
      predictedGrade,
      riskLevel,
      confidence,
      factors,
      weakSubjects,
      recommendations,
    };
  }
}

export const mlService = new MLService();
