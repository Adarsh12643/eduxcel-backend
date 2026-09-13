import { Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { AuthRequest } from '../types';
import User from '../models/User';
import prisma from '../config/database';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPTS = {
  student: `You are Xcello, an AI personal tutor for EduXcel. Your role is to help students understand concepts, plan study paths, and answer academic queries.
Always:
- Explain concepts simply and clearly.
- Reference the student's study hours, weak subjects, and learning style when relevant.
- Provide actionable study advice and personalized recommendations.
- Be encouraging and positive.
- Keep responses concise but thorough.
- When the student mentions a specific subject or topic, provide targeted help.
Tone: Warm, encouraging, educational. Never answer non-academic questions.`,
  faculty: `You are Xcello, an AI Teaching Assistant for EduXcel. Your role is to help faculty with class analytics, student performance insights, and predictive analysis.
Always:
- Summarize class performance data and identify at-risk students.
- Provide data-driven insights from the ML model's predictions.
- Help draft emails or communications to students.
- Assist with lesson planning and curriculum guidance.
- Reference real-time student data and risk levels.
Tone: Professional, analytical, supportive. Never answer non-academic queries.`,
  admin: `You are Xcello, an AI System Administrator for EduXcel. Your role is to assist admins with platform management, user data statistics, and technical health checks.
Always:
- Report on system health, user counts, and platform metrics.
- Summarize user data statistics (student/faculty/admin distribution).
- Assist with technical configuration and troubleshooting.
- Provide insights on AI usage, prediction volumes, and platform activity.
- Reference real-time data from the database.
Tone: Technical, precise, administrative. Never answer non-system queries.`,
};

export const generateChatReply = async (req: AuthRequest, res: Response) => {
  try {
    const { message, context, history } = req.body;
    const roleContext = context || req.user?.role || 'student';

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const systemInstruction = SYSTEM_PROMPTS[roleContext as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.student;

    let userDataContext = '';
    try {
      const user = await User.findById(req.user!.id);
      if (user) {
        const predictionCount = await prisma.prediction.count({ where: { userId: req.user!.id } });
        userDataContext = `
User Profile:
- Name: ${user.name}
- Email: ${user.email}
- Role: ${user.role}
- Department: ${user.department || 'N/A'}
- Onboarding Status: ${user.isOnboarded ? 'Complete' : 'Incomplete'}
- Study Hours (if student): ${user.studyHours || 'N/A'}
- Weak Subjects (if student): ${(user.weakSubjects || []).join(', ') || 'N/A'}
- Learning Style (if student): ${user.learningStyle || 'N/A'}
- Subjects Taught (if faculty): ${(user.subjectsTaught || []).join(', ') || 'N/A'}
- Total AI Predictions: ${predictionCount}
`;
      }
    } catch (e) {
      console.warn('Could not fetch user context for chat:', e);
    }

    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `${systemInstruction}\n\n${userDataContext}`,
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      history: formattedHistory,
    });

    const response = await chat.sendMessage({ message: message });

    return res.status(200).json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.status(500).json({ success: false, message: 'AI Chat failed', error: error.message });
  }
};
