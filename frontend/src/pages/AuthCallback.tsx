import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import Logo from '@/components/shared/Logo';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const bg = isDark ? '#0d1117' : '#f4f7f9';
  const surface = isDark ? '#161b22' : '#ffffff';
  const border = isDark ? '#30363d' : '#e2e8f0';
  const text = isDark ? '#e6edf3' : '#0B1E4A';
  const muted = isDark ? '#8b949e' : '#64748b';

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const error = searchParams.get('error');

    if (error) {
      console.error('Auth callback error:', error);
      navigate(`/auth?error=${error}`);
      return;
    }

    if (token && role) {
      const payload = parseJwt(token);
      if (payload) {
        localStorage.setItem('eduxcel_token', token);
        localStorage.setItem('eduxcel_user', JSON.stringify({
          id: payload.id,
          email: payload.email,
          name: payload.name,
          role: payload.role,
          isOnboarded: payload.isOnboarded,
          streak: payload.streak || 1,
        }));
        
        if (!payload.isOnboarded && role !== 'admin') {
          navigate('/onboarding');
        } else {
          if (role === 'student') navigate('/student/dashboard');
          else if (role === 'faculty') navigate('/faculty/dashboard');
          else navigate('/admin/dashboard');
        }
      } else {
       navigate('/auth?error=invalid_callback');
      }
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, transition: 'background 0.3s' }}>
      <div style={{ textAlign: 'center', padding: 32 }}>
        <Logo size="lg" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{ marginTop: 24 }}
        >
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #0047BA, #00A3E0)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16', animation: 'spin 1s linear infinite' }}>
            <Loader2 style={{ width: 28, height: 28, color: '#fff' }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: text, marginBottom: 8 }}>Completing Sign In</h2>
          <p style={{ color: muted, fontSize: 14 }}>Please wait while we redirect you...</p>
        </motion.div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}