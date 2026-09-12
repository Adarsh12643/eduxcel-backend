import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useGoogleLogin } from '@react-oauth/google';
import Logo from '@/components/shared/Logo';
import { Brain, GraduationCap, Users, ArrowRight, Lock, Mail, User, Moon, Sun } from 'lucide-react';
import { type Role } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import api, { API_BASE_URL } from '@/lib/api';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<Role>((searchParams.get('role') as Role) || 'student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const bg      = isDark ? '#0d1117' : '#f4f7f9';
  const surface = isDark ? '#161b22' : '#ffffff';
  const border  = isDark ? '#30363d' : '#e2e8f0';
  const text    = isDark ? '#e6edf3' : '#0B1E4A';
  const muted   = isDark ? '#8b949e' : '#64748b';
  const inputBg = isDark ? '#21262d' : '#f8fafc';

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      setGoogleLoading(true);
      try {
        const res = await api.auth.googleLogin(tokenResponse.access_token, role);
        localStorage.setItem('eduxcel_token', res.data.token);
        localStorage.setItem('eduxcel_user', JSON.stringify(res.data.user));
        if (role === 'student') navigate('/student/dashboard');
        else if (role === 'faculty') navigate('/faculty/dashboard');
        else navigate('/admin/dashboard');
      } catch (err: any) {
        setError(err.message || 'Google login failed');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setError('Google login was cancelled or failed');
      setGoogleLoading(false);
    },
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const email = (form.querySelector('#email') as HTMLInputElement).value;
    const password = (form.querySelector('#password') as HTMLInputElement).value;
    const name = (form.querySelector('#name') as HTMLInputElement)?.value;
    try {
      if (isLogin) {
        const res = await api.auth.login(email, password, role);
        localStorage.setItem('eduxcel_token', res.data.token);
        localStorage.setItem('eduxcel_user', JSON.stringify(res.data.user));
        if (role === 'student') navigate('/student/dashboard');
        else if (role === 'faculty') navigate('/faculty/dashboard');
        else navigate('/admin/dashboard');
      } else {
        const res = await api.auth.register(email, password, name, role);
        localStorage.setItem('eduxcel_token', res.data.token);
        localStorage.setItem('eduxcel_user', JSON.stringify(res.data.user));
        if (role === 'student') navigate('/student/dashboard');
        else if (role === 'faculty') navigate('/faculty/dashboard');
        else navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const hasClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
    if (hasClientId) {
      googleLogin();
    } else {
      window.location.href = `${API_BASE_URL}/auth/google?role=${role}`;
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px 10px 40px', borderRadius: 10,
    border: `1px solid ${border}`, background: inputBg, color: text,
    fontSize: 14, outline: 'none', transition: 'border 0.2s',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: muted, display: 'block', marginBottom: 6 };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: bg, transition: 'background 0.3s', position: 'relative', overflow: 'auto' }}>

      {/* Theme Toggle */}
      <button onClick={toggleTheme}
        style={{ position: 'fixed', top: 16, right: 16, zIndex: 100, padding: 10, borderRadius: '50%', background: surface, border: `1px solid ${border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
        {isDark ? <Sun style={{ width: 18, height: 18, color: '#fbbf24' }} /> : <Moon style={{ width: 18, height: 18, color: '#475569' }} />}
      </button>

      {/* Left branding panel */}
      <div style={{ display: 'none', width: '50%', background: '#0B1E4A', flexDirection: 'column', justifyContent: 'center', gap: 48, padding: 48, position: 'relative', overflow: 'hidden' }} className="lg-flex">
        <style>{`.lg-flex { display: none; } @media(min-width:1024px){ .lg-flex { display: flex !important; } }`}</style>
        <div style={{ position: 'absolute', top: '20%', left: '-20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(53,103,251,0.4) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-20%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,163,224,0.3) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Logo size="lg" showText={false} />
          <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginTop: 16, letterSpacing: '-0.03em' }}>EduXcel</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '6px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#00A3E0', fontSize: 12, fontWeight: 700 }}>
            <Brain style={{ width: 14, height: 14 }} /> AI Student Performance Catalyst
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 20 }}>
            Predict. Explain.<br />
            <span style={{ background: 'linear-gradient(135deg, #00A3E0, #8aaaff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Recover.</span>
          </h2>
          <p style={{ color: '#93c5fd', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
            An intelligent education operating system that identifies academic risk early and provides personalized pathways to success.
          </p>
          <div style={{ display: 'flex', gap: 12, color: '#93c5fd', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <span>Learn Today</span><span>•</span><span>Excel Tomorrow</span><span>•</span><span>Succeed Forever</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(53,103,251,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
          {/* Mobile logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
            <Logo size="lg" />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ background: surface, border: `1px solid ${border}`, borderRadius: 20, padding: 32, boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(11,30,74,0.08)' }}>

            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: text, marginBottom: 8, letterSpacing: '-0.02em' }}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p style={{ color: muted, fontSize: 14 }}>
                {isLogin ? 'Enter your credentials to access your portal' : 'Join EduXcel to transform your academic journey'}
              </p>
            </div>

            {error && (
              <div style={{ marginBottom: 16, padding: '10px 14px', background: isDark ? 'rgba(239,68,68,0.1)' : '#fef2f2', border: `1px solid ${isDark ? 'rgba(239,68,68,0.3)' : '#fecaca'}`, borderRadius: 10, fontSize: 13, color: isDark ? '#f87171' : '#dc2626' }}>
                {error}
              </div>
            )}

            {/* Role selector */}
            <div style={{ display: 'flex', background: isDark ? '#21262d' : '#f1f5f9', borderRadius: 10, padding: 4, marginBottom: 24 }}>
              {(['student', 'faculty', 'admin'] as Role[]).map(r => (
                <button key={r} onClick={() => setRole(r)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 4px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                    background: role === r ? surface : 'transparent',
                    color: role === r ? '#0047BA' : muted,
                    boxShadow: role === r ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  }}>
                  {r === 'student' && <GraduationCap style={{ width: 14, height: 14 }} />}
                  {r === 'faculty' && <Users style={{ width: 14, height: 14 }} />}
                  {r === 'admin' && <Lock style={{ width: 14, height: 14 }} />}
                  <span style={{ textTransform: 'capitalize' }}>{r}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <label style={labelStyle}>Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <User style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: muted }} />
                      <input id="name" type="text" required placeholder="John Doe" style={inputStyle} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: muted }} />
                  <input id="email" type="email" required placeholder="you@institution.edu" style={inputStyle} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                  {isLogin && <a href="#" style={{ fontSize: 12, fontWeight: 600, color: '#0047BA', textDecoration: 'none' }}>Forgot password?</a>}
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: muted }} />
                  <input id="password" type="password" required placeholder="••••••••" style={inputStyle} />
                </div>
              </div>

              {isLogin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" id="remember" style={{ accentColor: '#0047BA' }} />
                  <label htmlFor="remember" style={{ fontSize: 13, color: muted, cursor: 'pointer' }}>Remember me for 30 days</label>
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '12px', background: '#0047BA', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1, boxShadow: '0 4px 16px rgba(0,71,186,0.3)', transition: 'background 0.2s', marginTop: 4 }}
                onMouseEnter={e => !loading && (e.currentTarget.style.background = '#003299')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0047BA')}>
                {loading
                  ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  : <>{isLogin ? 'Sign In to Dashboard' : 'Create Account'} <ArrowRight style={{ width: 16, height: 16 }} /></>
                }
              </button>

              <button type="button" onClick={handleGoogleLogin} disabled={googleLoading}
                style={{ width: '100%', padding: '12px', background: surface, color: text, border: `1px solid ${border}`, borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: googleLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 12, transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = isDark ? '#21262d' : '#f1f5f9')}
                onMouseLeave={e => (e.currentTarget.style.background = surface)}>
                {googleLoading
                  ? <div style={{ width: 18, height: 18, border: `2px solid ${border}`, borderTopColor: '#0047BA', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  : <>
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </>
                }
              </button>
            </form>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: muted }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setIsLogin(!isLogin)}
                  style={{ background: 'none', border: 'none', color: '#0047BA', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                  {isLogin ? 'Register now' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>

          {/* Demo credentials hint */}
          <div style={{ marginTop: 16, padding: '12px 16px', background: isDark ? 'rgba(53,103,251,0.08)' : '#eef3ff', border: `1px solid ${isDark ? 'rgba(53,103,251,0.2)' : '#c6d6ff'}`, borderRadius: 12, fontSize: 12, color: isDark ? '#8aaaff' : '#0047BA', textAlign: 'center' }}>
            Demo: <strong>student@eduxcel.com</strong> / <strong>password123</strong>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}