import { IUser } from '../models/User';
import prisma from '../config/database';

// ── Interfaces ────────────────────────────────────────────────────────────────

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

// ── Curated YouTube channels shown when ML service is unavailable ─────────────

const FALLBACK_CHANNELS: VideoResult[] = [
  {
    title: 'Khan Academy',
    link: 'https://www.youtube.com/c/khanacademy',
    channel: 'Khan Academy',
    channelId: 'UC4a-Gbdw7vOaccHmFo40b9g',
    thumbnail: 'https://yt3.ggpht.com/yVI9x1hDVFPpS5b2gy0_khxMT1TGVGEe7VZWFCmR-vEGRr3HfKhBnLiRSGfClwFfzPXMzNE=s176-c-k-c0x00ffffff-no-rj',
    videoCount: '8,000+',
    isTopPick: true,
  },
  {
    title: 'The Organic Chemistry Tutor',
    link: 'https://www.youtube.com/c/TheOrganicChemistryTutor',
    channel: 'The Organic Chemistry Tutor',
    channelId: 'UCEWpbFLzoYGPfuWUMFPSaoA',
    thumbnail: 'https://yt3.ggpht.com/ytc/AIdro_kbXYXg0YXn0ZFdMLGBX7sQ1Fj1mRrpXmLdMh2E=s176-c-k-c0x00ffffff-no-rj',
    videoCount: '5,000+',
    isTopPick: false,
  },
  {
    title: 'MIT OpenCourseWare',
    link: 'https://www.youtube.com/c/mitocw',
    channel: 'MIT OpenCourseWare',
    channelId: 'UCEBb1b_L6zDS3xTUrIALZOw',
    thumbnail: 'https://yt3.ggpht.com/ytc/AIdro_k5SbMiXjRv2lzHjXSPOY3Y_A3RV3KXu8BN6Kkg=s176-c-k-c0x00ffffff-no-rj',
    videoCount: '3,500+',
    isTopPick: false,
  },
  {
    title: 'freeCodeCamp',
    link: 'https://www.youtube.com/c/Freecodecamp',
    channel: 'freeCodeCamp.org',
    channelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
    thumbnail: 'https://yt3.ggpht.com/ytc/AIdro_kX3N5LQTvBCNhHcmNL6Y2g-DtqEwdU_3DkJKBE=s176-c-k-c0x00ffffff-no-rj',
    videoCount: '1,200+',
    isTopPick: false,
  },
  {
    title: 'NPTEL',
    link: 'https://www.youtube.com/c/nptel',
    channel: 'NPTEL',
    channelId: 'UCNnDjqlPkEGz3kQSLkYtEEg',
    thumbnail: 'https://yt3.ggpht.com/ytc/AIdro_kVnWNBKQnGcnXn1XqyZX3Rl5M7_KYTBnKB6qS=s176-c-k-c0x00ffffff-no-rj',
    videoCount: '6,000+',
    isTopPick: false,
  },
];

// ── ML Service class ──────────────────────────────────────────────────────────

export class MLService {
  private mlServiceUrl: string;

  constructor() {
    this.mlServiceUrl = process.env.ML_SERVICE_URL || 'https://eduxcel-backend-ml-service.onrender.com';
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private describeStep(step: string, weakSubjects: string[]): string {
    const subjectList = weakSubjects.join(', ') || 'your weak subjects';
    switch (step) {
      case 'focus_on_weak_subjects':
        return `Your performance in ${subjectList} needs improvement. Dedicate extra study time to these subjects.`;
      case 'practice_mock_tests':
        return 'Attempting mock tests will help you get familiar with exam patterns and improve time management.';
      case 'improve_attendance':
        return 'Your attendance is low. Regular class attendance significantly improves understanding of concepts.';
      case 'consult_with_professors':
        return `Don't hesitate to ask for help. Your professors can provide personalised guidance on ${subjectList}.`;
      case 'increase_study_hours':
        return 'Try to study at least 4–6 hours a day. Consistent daily effort compounds over time.';
      default:
        return 'Follow the personalised steps to steadily improve your academic performance.';
    }
  }

  // ── Pure-JS grade prediction (no Python, no external service) ─────────────

  private jsFallbackPredict(opts: {
    attendance: number;
    internalMarks: number;
    assignmentCompletion: number;
    targets: string[];
  }): { predictedGrade: string; riskLevel: string; confidence: number; recommendations: string[] } {
    const { attendance, internalMarks, assignmentCompletion, targets } = opts;

    // Simple weighted score
    const score = internalMarks * 0.6 + attendance * 0.25 + assignmentCompletion * 0.15;

    let predictedGrade: string;
    let riskLevel: string;
    if (score >= 80)      { predictedGrade = 'A'; riskLevel = 'Low'; }
    else if (score >= 65) { predictedGrade = 'B'; riskLevel = 'Low'; }
    else if (score >= 50) { predictedGrade = 'C'; riskLevel = 'Medium'; }
    else if (score >= 35) { predictedGrade = 'D'; riskLevel = 'High'; }
    else                  { predictedGrade = 'F'; riskLevel = 'High'; }

    const recs: string[] = [];
    if (targets.length > 0)        recs.push('focus_on_weak_subjects');
    if (attendance < 75)           recs.push('improve_attendance');
    if (internalMarks < 60)        recs.push('practice_mock_tests');
    recs.push('consult_with_professors');

    return { predictedGrade, riskLevel, confidence: 72, recommendations: recs };
  }

  // ── YouTube recommendations ────────────────────────────────────────────────

  async getYouTubeRecommendations(subjects: string[]): Promise<VideoResult[]> {
    if (!subjects || subjects.length === 0) return FALLBACK_CHANNELS;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(`${this.mlServiceUrl}/youtube`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjects, learningStyle: 'visual' }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const data: any = await response.json();
        const channels = data.videos || data.channels;
        if (channels && Array.isArray(channels) && channels.length > 0) {
          return channels.map((c: any, i: number) => ({
            title: c.channel_name || c.channel || c.title || 'Recommended Channel',
            link: c.link || `https://www.youtube.com/channel/${c.channel_id || c.channelId}`,
            channel: c.channel_name || c.channel || '',
            channelId: c.channel_id || c.channelId || '',
            thumbnail: c.thumbnail || '',
            videoCount: c.video_count || c.videoCount || 'N/A',
            isTopPick: c.is_top_pick || c.isTopPick || i === 0,
          }));
        }
      }
    } catch {
      console.warn('YouTube ML endpoint unavailable — using curated fallback channels.');
    }

    return FALLBACK_CHANNELS;
  }

  // ── Recovery plan (NEVER throws — always returns a valid plan) ────────────

  async getRecoveryPlan(userId: string): Promise<RecoveryPlan> {
    // 1. Load user data from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true },
    });
    if (!user) throw new Error('User not found');

    const studentProfile = await prisma.studentProfile.findUnique({
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

    // 2. Derive stats
    let subjectPerformance: Record<string, number> = {};
    let attendance = 70;
    let internalMarks = 60;
    let assignmentCompletion = 50;
    let previousSGPA = 6.0;
    const semester = user.semester || 1;

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

    const weakSubjects = studentProfile?.weakSubjects.map((ws) => ws.subject.name) || [];
    for (const ws of weakSubjects) {
      if (!(ws in subjectPerformance)) subjectPerformance[ws] = 40;
    }

    const targets = weakSubjects.length > 0
      ? weakSubjects
      : Object.keys(subjectPerformance).filter((k) => subjectPerformance[k] < 60 && !k.startsWith('_'));

    // 3. Try ML service first (with a 25-second timeout for Render cold-start)
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(`${this.mlServiceUrl}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const data = (await response.json()) as any;
        const prediction = data.prediction || data;

        const channels: VideoResult[] = (data.videos || data.channels || []).map((c: any, i: number) => ({
          title: c.title || c.channel_name || c.channel || 'Recommended Video',
          link: c.link || `https://www.youtube.com/channel/${c.channel_id || c.channelId}`,
          channel: c.channel || c.channel_name || '',
          channelId: c.channelId || c.channel_id || '',
          thumbnail: c.thumbnail || '',
          views: c.views || c.viewCount || '',
          duration: c.duration || '',
          isTopPick: c.isTopPick || c.is_top_pick || i === 0,
        }));

        const statuses: Array<'done' | 'in_progress' | 'pending'> = ['done', 'in_progress', 'pending', 'pending', 'pending'];
        const recommendations: Recommendation[] = (prediction.recommendations || []).map((rec: string, idx: number) => ({
          step: rec,
          desc: this.describeStep(rec, prediction.weakSubjects || targets),
          status: statuses[idx] ?? 'pending',
        }));

        if (recommendations.length === 0) {
          recommendations.push({ step: 'Review weak areas', desc: 'Focus on subjects where scores are below 60%.', status: 'in_progress' });
        }

        return {
          predictedGrade: prediction.predictedGrade || 'N/A',
          riskLevel: prediction.riskLevel || 'Low',
          confidence: prediction.confidence || 72,
          weakSubjects: prediction.weakSubjects || targets,
          recommendations,
          videoRecommendations: channels.length > 0 ? channels : FALLBACK_CHANNELS,
        };
      }
    } catch {
      console.warn('ML /recommend endpoint unavailable — using JS fallback for recovery plan.');
    }

    // 4. Pure-JS fallback — never throws, always works
    const fb = this.jsFallbackPredict({ attendance, internalMarks, assignmentCompletion, targets });

    const statuses: Array<'done' | 'in_progress' | 'pending'> = ['in_progress', 'pending', 'pending', 'pending'];
    const recommendations: Recommendation[] = fb.recommendations.map((step, idx) => ({
      step,
      desc: this.describeStep(step, targets),
      status: statuses[idx] ?? 'pending',
    }));

    const videos = await this.getYouTubeRecommendations(targets);

    return {
      predictedGrade: fb.predictedGrade,
      riskLevel: fb.riskLevel,
      confidence: fb.confidence,
      weakSubjects: targets,
      recommendations,
      videoRecommendations: videos,
    };
  }

  // ── What-if simulation (pure JS, no Python) ───────────────────────────────

  async simulateWhatIf(data: any): Promise<any> {
    const { attendance = 70, internalMarks = 60, assignmentCompletion = 50, subjects = [] } = data;
    return this.jsFallbackPredict({ attendance, internalMarks, assignmentCompletion, targets: subjects });
  }

  // ── Predict (kept for compatibility, but now uses JS fallback) ────────────

  async predict(data: any): Promise<any> {
    const { attendance = 70, internalMarks = 60, assignmentCompletion = 50, subjectPerformance = {} } = data;
    const targets = Object.keys(subjectPerformance).filter((k) => subjectPerformance[k] < 60 && !k.startsWith('_'));

    // Try ML service
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      const response = await fetch(`${this.mlServiceUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (response.ok) return await response.json();
    } catch {
      console.warn('ML /predict endpoint unavailable — using JS fallback.');
    }

    return this.jsFallbackPredict({ attendance, internalMarks, assignmentCompletion, targets });
  }
}

export const mlService = new MLService();