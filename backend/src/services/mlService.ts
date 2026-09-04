import { PredictionInput, PredictionResult } from '../types';

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

      return await response.json() as PredictionResult;
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

  private fallbackPredict(input: PredictionInput): PredictionResult {
    const { attendance, internalMarks, previousSGPA, assignmentCompletion, subjectPerformance } = input;

    const attendanceScore = attendance / 100;
    const marksScore = internalMarks / 100;
    const sgpaScore = previousSGPA / 10;
    const assignmentScore = assignmentCompletion / 100;

    const subjectAvg = Object.values(subjectPerformance).length > 0
      ? Object.values(subjectPerformance).reduce((a, b) => a + b, 0) / Object.values(subjectPerformance).length / 100
      : 0.5;

    const overallScore = (attendanceScore * 0.3) + (marksScore * 0.3) + (sgpaScore * 0.2) + (assignmentScore * 0.1) + (subjectAvg * 0.1);

    const confidence = Math.min(95, Math.max(60, Math.round(overallScore * 100)));

    const weakSubjects = Object.entries(subjectPerformance)
      .filter(([_, score]) => score < 60)
      .map(([subject, _]) => subject);

    const riskLevel = overallScore >= 0.7 ? 'Low' : overallScore >= 0.5 ? 'Medium' : 'High';

    const gradeMap: Record<number, string> = {
      10: 'A+', 9: 'A', 8: 'B+', 7: 'B', 6: 'C+', 5: 'C', 4: 'D', 0: 'F'
    };

    const gradeIndex = Math.floor(overallScore * 10);
    const predictedGrade = gradeMap[Math.min(gradeIndex, 10)] || 'C';

    const factors = [
      { factor: 'Attendance', impact: attendanceScore < 0.7 ? 'Critical Negative' : 'Positive', value: Math.round(attendanceScore * 100) },
      { factor: 'Internal Marks', impact: marksScore < 0.7 ? 'High Negative' : 'Positive', value: Math.round(marksScore * 100) },
      { factor: 'Previous SGPA', impact: sgpaScore < 0.7 ? 'Moderate Negative' : 'Positive', value: Math.round(sgpaScore * 100) },
      { factor: 'Assignment Completion', impact: assignmentScore < 0.7 ? 'High Negative' : 'Positive', value: Math.round(assignmentScore * 100) },
    ];

    const recommendations = [
      ...weakSubjects.map(s => `Focus on improving ${s} through targeted practice`),
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
