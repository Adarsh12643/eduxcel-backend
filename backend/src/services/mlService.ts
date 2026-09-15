import { spawn } from 'child_process';
import { IUser } from '../models/User';
import prisma from '../config/database';

// Define interfaces for our data structures right here for clarity
export interface VideoResult {
  title: string;
  link: string;
  channel: string;
  channelId: string;
  thumbnail: string;
  views?: string;
  duration?: string;
  videoCount?: string;
  isTopPick: boolean;
}

export interface Recommendation {
  step: string;
  desc: string;
  status: 'done' | 'in_progress' | 'pending';
}

export interface RecoveryPlan {
  predictedGrade: string;
  riskLevel: string;
  confidence: number;
  weakSubjects: string[];
  recommendations: Recommendation[];
  videoRecommendations: (VideoResult & { isTopPick: boolean })[];
}


export class MLService {
  private mlServiceUrl: string;
  private pythonScriptPath: string;

  constructor() {
    this.mlServiceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5000';
    this.pythonScriptPath = process.env.PYTHON_SCRIPT_PATH || 'src/services/main.py';
  }

  private getRecommendationDescription(recommendation: string, weakSubjects: string[]): string {
    const subjectList = weakSubjects.join(', ');
    switch (recommendation) {
      case 'focus_on_weak_subjects':
        return `Your performance in ${subjectList} is below average. Dedicate extra study time to these subjects.`;
      case 'practice_mock_tests':
        return 'Attempting mock tests can help you get familiar with the exam pattern and improve time management.';
      case 'improve_attendance':
        return 'Your attendance is low. Attending classes regularly can help you understand concepts better.';
      case 'consult_with_professors':
        return `Don't hesitate to ask for help. Your professors for ${subjectList} can provide personalized guidance.`;
      default:
        return 'Follow the personalized steps to improve your academic performance.';
    }
  }

  async getYouTubeRecommendations(subjects: string[]): Promise<VideoResult[]> {
    console.log('Fetching YouTube recommendations for subjects:', subjects);
    try {
      const response = await fetch(`${this.mlServiceUrl}/youtube`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'some-user-id',
          subjects: subjects,
          learningStyle: 'visual',
        }),
      });

      if (response.ok) {
        const data: any = await response.json();
        console.log('YouTube recommendations from ML service:', data);
        if (data.channels && Array.isArray(data.channels) && data.channels.length > 0) {
          return data.channels.map((channel: any, index: number) => ({
            title: channel.channel_name || 'Recommended Channel',
            link: `https://www.youtube.com/channel/${channel.channel_id}`,
            channel: channel.channel_name || '',
            channelId: channel.channel_id || '',
            thumbnail: channel.thumbnail || '',
            videoCount: channel.video_count || 'N/A',
            isTopPick: channel.is_top_pick || index === 0,
          }));
        }
      }
    } catch (error) {
      console.warn('YouTube ML endpoint unavailable, using fallback channel recommendations.');
    }

    // Fallback to a curated list of channels if the service fails or returns no channels
    const fallbackChannels: VideoResult[] = [
      {
        title: 'Khan Academy',
        link: 'https://www.youtube.com/channel/UC4a-Gbdw7vOaccHmFo40b9g',
        channel: 'Khan Academy',
        channelId: 'UC4a-Gbdw7vOaccHmFo40b9g',
        thumbnail: '',
        videoCount: '8,000+',
        isTopPick: true,
      },
      {
        title: 'The Organic Chemistry Tutor',
        link: 'https://www.youtube.com/channel/UCEWpbFLzoYGPfuWUMFPSaoA',
        channel: 'The Organic Chemistry Tutor',
        channelId: 'UCEWpbFLzoYGPfuWUMFPSaoA',
        thumbnail: '',
        videoCount: '5,000+',
        isTopPick: false,
      },
    ];
    console.log('Using fallback YouTube channels.');
    return fallbackChannels;
  }

  async getRecoveryPlan(userId: string): Promise<RecoveryPlan> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
      },
    });
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

    const prevScores = await prisma.previousScore.findMany({
      where: { userId },
      include: { subject: true },
    });

    let subjectPerformance: Record<string, number> = {};
    let attendance = 70;
    let internalMarks = 60;
    let assignmentCompletion = 50;
    let previousSGPA = 6.0;
    let semester = user.semester || 1;

    if (prevScores.length > 0) {
      let total = 0;
      for (const p of prevScores) {
        subjectPerformance[p.subject.name] = p.total || 0;
        total += p.total || 0;
      }
      internalMarks = Math.round(total / prevScores.length);
      if (studentProfile) {
        attendance = studentProfile.attendance || 70;
        assignmentCompletion = studentProfile.assignmentCompletion || 50;
        previousSGPA = studentProfile.previousSGPA || studentProfile.currentSGPA || 6.0;
      }
    } else if (studentProfile) {
      attendance = studentProfile.attendance || 70;
      internalMarks = studentProfile.internalMarks || 60;
      assignmentCompletion = studentProfile.assignmentCompletion || 50;
      previousSGPA = studentProfile.previousSGPA || studentProfile.currentSGPA || 6.0;

      for (const subj of studentProfile.subjects) {
        subjectPerformance[subj.subject.name] = subj.currentScore || 50;
      }
    }

    if (user.studentProfile?.studyHours != null) {
      subjectPerformance['_studyHours'] = user.studentProfile.studyHours;
    }

    const weakSubjects = studentProfile?.weakSubjects.map((ws) => ws.subject.name) || [];

    if (weakSubjects.length > 0) {
      for (const ws of weakSubjects) {
        if (!(ws in subjectPerformance)) {
          subjectPerformance[ws] = 40;
        }
      }
    }

    const targets = weakSubjects.length > 0
        ? weakSubjects
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
      studyHours: user.studentProfile?.studyHours,
      learningStyle: user.studentProfile?.learningStyle,
    };

    try {
      const response = await fetch(`${this.mlServiceUrl}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = (await response.json()) as any;
        const prediction = data.prediction || data;
        const channels: VideoResult[] = (data.channels || []).map((c: any, i: number) => ({
          title: c.channel_name || 'Recommended Channel',
          link: `https://www.youtube.com/channel/${c.channel_id}`,
          channel: c.channel_name || '',
          channelId: c.channel_id || '',
          thumbnail: c.thumbnail || '',
          videoCount: c.video_count || 'N/A',
          isTopPick: c.is_top_pick || i === 0,
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
          videoRecommendations: channels,
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

    const videos = await this.getYouTubeRecommendations(targets);

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
      predictedGrade: prediction.predictedGrade,
      riskLevel: prediction.riskLevel,
      confidence: prediction.confidence,
      weakSubjects: prediction.weakSubjects,
      recommendations,
      videoRecommendations: videos,
    };
  }

  async predict(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const process = spawn('python', [this.pythonScriptPath, JSON.stringify(data)]);
      let result = '';
      process.stdout.on('data', (data) => {
        result += data.toString();
      });
      process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        reject(data);
      });
      process.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`Python script exited with code ${code}`));
        }
        try {
          resolve(JSON.parse(result));
        } catch (e) {
          reject(new Error('Failed to parse python script output'));
        }
      });
    });
  }

  async simulateWhatIf(data: any): Promise<any> {
    // This is a simplified simulation. For a real-world scenario,
    // you might have a separate model or logic for simulations.
    return this.predict(data);
  }
}