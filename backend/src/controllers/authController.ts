import { Response, Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import { AuthRequest } from '../types';
import { updateLoginStreak, getUserStreak } from '../models/EduXcelLogin';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL || 'https://eduxcel-backend-1.onrender.com/api/auth/google/callback'
);

export const googleOAuthRedirect = async (req: Request, res: Response) => {
  try {
    const role = (req.query.role as string) || 'student';
    const validRoles = ['student', 'faculty', 'admin'];
    if (!validRoles.includes(role)) {
      return res.redirect(`${process.env.CLIENT_URL || 'https://eduxcel-frontend.web.app'}/auth?error=invalid_role`);
    }

    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    const authUrl = googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: role,
      prompt: 'consent',
    });

    return res.redirect(authUrl);
  } catch (error: any) {
    console.error('Google OAuth redirect error:', error);
    const redirectUrl = `${process.env.CLIENT_URL || 'https://eduxcel-frontend.web.app'}/auth?error=oauth_init_failed`;
    return res.redirect(redirectUrl);
  }
};

export const googleOAuthCallback = async (req: Request, res: Response) => {
  const frontendUrl = process.env.CLIENT_URL?.replace(/\/$/, '') || 'https://eduxcel-frontend.web.app';

  try {
    const { code, state } = req.query;

    const validRoles = ['student', 'faculty', 'admin'] as const;
    const role = (state as string) || 'student';
    if (!validRoles.includes(role as any)) {
      return res.redirect(`${frontendUrl}/auth?error=invalid_role`);
    }
    const typedRole = role as 'student' | 'faculty' | 'admin';

    if (!code) {
      return res.redirect(`${frontendUrl}/auth?error=missing_code`);
    }

    const { tokens } = await googleClient.getToken(code as string);
    googleClient.setCredentials(tokens);

    if (!tokens.id_token) {
      return res.redirect(`${frontendUrl}/auth?error=missing_id_token`);
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.redirect(`${frontendUrl}/auth?error=invalid_token`);
    }

    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (user.authProvider === 'local' && !user.googleId) {
        user.googleId = payload.sub;
        user.authProvider = 'google';
        user.avatar = picture || user.avatar;
        await user.save();
      }
      if (user.role !== role) {
        return res.redirect(`${frontendUrl}/auth?error=invalid_role`);
      }
    } else {
      user = await User.create({
        email,
        name: name || email.split('@')[0],
        googleId,
        authProvider: 'google',
        role: typedRole,
        avatar: picture,
        password: undefined,
      });
    }

    const streak = await updateLoginStreak(String(user._id));
    const token = jwt.sign(
      { id: String(user._id), email: user.email, role: user.role, name: user.name, isOnboarded: user.isOnboarded, streak },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return res.redirect(`${frontendUrl}/auth/callback?token=${token}&role=${typedRole}`);
  } catch (error: any) {
    console.error('Google OAuth callback error:', error);
    return res.redirect(`${frontendUrl}/auth?error=oauth_failed`);
  }
};

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name, role, department } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ success: false, message: 'Email, password, name and role are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role,
      department,
      authProvider: 'local',
    });

    const streak = await updateLoginStreak(String(user._id));
    const token = jwt.sign(
      { id: String(user._id), email: user.email, role: user.role, name: user.name, isOnboarded: user.isOnboarded, streak },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
          avatar: user.avatar,
          isOnboarded: user.isOnboarded,
          streak,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Email, password and role are required' });
    }

    const user = await User.findOne({ email, authProvider: 'local' });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.role !== role) {
      return res.status(401).json({ success: false, message: 'Invalid role for this account' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const streak = await updateLoginStreak(String(user._id));
    const token = jwt.sign(
      { id: String(user._id), email: user.email, role: user.role, name: user.name, isOnboarded: user.isOnboarded, streak },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
          avatar: user.avatar,
          isOnboarded: user.isOnboarded,
          streak,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
};

export const googleLogin = async (req: AuthRequest, res: Response) => {
  try {
    const { idToken, accessToken, role } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required' });
    }

    let email: string | undefined;
    let name: string | undefined;
    let picture: string | undefined;
    let googleId: string | undefined;

    if (idToken) {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return res.status(400).json({ success: false, message: 'Invalid Google token' });
      }
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
      googleId = payload.sub;
    } else if (accessToken) {
      const fetch = (await import('node-fetch')).default;
      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!userInfoRes.ok) {
        return res.status(400).json({ success: false, message: 'Invalid Google access token' });
      }
      const userInfo = await userInfoRes.json() as { email: string; name: string; picture: string; id: string };
      email = userInfo.email;
      name = userInfo.name;
      picture = userInfo.picture;
      googleId = userInfo.id;
    } else {
      return res.status(400).json({ success: false, message: 'Google token or access token is required' });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (user.authProvider === 'local' && !user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        user.avatar = picture || user.avatar;
        await user.save();
      }
      if (user.role !== role) {
        return res.status(400).json({ success: false, message: 'Invalid role for this account' });
      }
    } else {
      user = await User.create({
        email,
        name: name || email.split('@')[0],
        googleId,
        authProvider: 'google',
        role,
        avatar: picture,
        password: undefined,
      });
    }

    const streak = await updateLoginStreak(String(user._id));
    const token = jwt.sign(
      { id: String(user._id), email: user.email, role: user.role, name: user.name, isOnboarded: user.isOnboarded, streak },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
          avatar: user.avatar,
          isOnboarded: user.isOnboarded,
          streak,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Google login error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Google login failed' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const streakData = await getUserStreak(String(user._id));

    return res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        id: user._id,
        streak: streakData.currentStreak,
        highestStreak: streakData.highestStreak,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

export const getStreak = async (req: AuthRequest, res: Response) => {
  try {
    const streakData = await getUserStreak(req.user!.id);
    return res.status(200).json({
      success: true,
      data: streakData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch streak' });
  }
};

export const onboard = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const updates = req.body;

    if (user.role === 'student') {
      user.studyHours = updates.studyHours ?? updates.studyHours === 0 ? updates.studyHours : user.studyHours;
      user.weakSubjects = updates.weakSubjects || user.weakSubjects;
      user.learningStyle = updates.learningStyle || user.learningStyle;
    }

    if (user.role === 'student' || user.role === 'faculty') {
      user.department = updates.department || user.department;
    }

    if (user.role === 'faculty') {
      user.subjectsTaught = updates.subjectsTaught || user.subjectsTaught;
    }

    user.semester = updates.semester ?? user.semester;
    user.section = updates.section || user.section;
    user.batch = updates.batch || user.batch;
    user.rollNumber = updates.rollNumber || user.rollNumber;
    user.employeeId = updates.employeeId || user.employeeId;
    user.targetSGPA = updates.targetSGPA ?? user.targetSGPA;

    user.isOnboarded = true;
    await user.save();

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Onboarding error:', error);
    return res.status(500).json({ success: false, message: 'Onboarding failed' });
  }
};
