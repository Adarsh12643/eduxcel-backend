import { Response, Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import { AuthRequest } from '../types';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://eduxcel-backend-c20f.onrender.com/api/auth/google/callback'
);

export const googleOAuthRedirect = async (req: Request, res: Response) => {
  try {
    const role = req.query.role as string || 'student';
    
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
    return res.status(500).json({ success: false, message: error.message || 'OAuth redirect failed' });
  }
};

export const googleOAuthCallback = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;
    
    // Validate role
    const validRoles = ['student', 'faculty', 'admin'] as const;
    const role = (state as string) || 'student';
    if (!validRoles.includes(role as any)) {
      return res.redirect('https://eduxcel-frontend.web.app/auth?error=invalid_role');
    }
    const typedRole = role as 'student' | 'faculty' | 'admin';
    
    if (!code) {
      return res.redirect('https://eduxcel-frontend.web.app/auth?error=missing_code');
    }

    const { tokens } = await googleClient.getToken(code as string);
    googleClient.setCredentials(tokens);

    if (!tokens.id_token) {
      return res.redirect('https://eduxcel-frontend.web.app/auth?error=missing_id_token');
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.redirect('https://eduxcel-frontend.web.app/auth?error=invalid_token');
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
        return res.redirect('https://eduxcel-frontend.web.app/auth?error=invalid_role');
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

    const token = jwt.sign(
      { id: String(user._id), email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return res.redirect(`https://eduxcel-frontend.web.app/auth/callback?token=${token}&role=${typedRole}`);
  } catch (error: any) {
    console.error('Google OAuth callback error:', error);
    return res.redirect('https://eduxcel-frontend.web.app/auth?error=oauth_failed');
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

    const token = jwt.sign(
      { id: String(user._id), email: user.email, role: user.role, name: user.name },
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

    const token = jwt.sign(
      { id: String(user._id), email: user.email, role: user.role, name: user.name },
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

    const token = jwt.sign(
      { id: String(user._id), email: user.email, role: user.role, name: user.name },
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

    return res.status(200).json({ success: true, data: { ...user.toObject(), id: user._id } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};
