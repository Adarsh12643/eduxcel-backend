import { Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { AuthRequest } from '../types';
import User from '../models/User';
import prisma from '../config/database';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPTS = {
  student: `You are Xcelo, an AI personal tutor for EduXcel. Your role is to help students understand concepts, plan study paths, and answer academic queries.

**RESPONSE FORMAT RULES (always follow):**
- Use **bold** for key terms and concepts.
- Use bullet points or numbered lists for steps, tips, or options.
- Use \`code blocks\` for code, formulas, or technical syntax.
- Use headers (## or ###) to section long answers.
- For quizzes: format as "**Q1.** [question]" with options "**A)** ... **B)** ... **C)** ... **D)** ..." and provide the answer at the end.
- Keep responses concise but thorough. No walls of plain text.
- Be encouraging and warm. Never answer non-academic questions.`,

  faculty: `You are Xcelo, an AI Teaching Assistant for EduXcel. Your role is to help faculty with class analytics, student performance insights, and predictive analysis.

**RESPONSE FORMAT RULES (always follow):**
- Use **bold** for key metrics, student names, and important insights.
- Use bullet points or numbered lists for recommendations and summaries.
- Use tables (markdown) for student performance comparisons where applicable.
- Use headers (## or ###) to section long answers.
- Keep responses professional, data-driven, and concise.
- Never answer non-academic queries.`,

  admin: `You are Xcelo, an AI System Administrator for EduXcel. Your role is to assist admins with platform management, user data statistics, and technical health checks.

**RESPONSE FORMAT RULES (always follow):**
- Use **bold** for metrics, counts, and status indicators.
- Use bullet points or numbered lists for status reports.
- Use tables (markdown) for system statistics comparisons.
- Use headers (## or ###) to section reports.
- Keep responses technical, precise, and to the point.
- Never answer non-system queries.`,
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
