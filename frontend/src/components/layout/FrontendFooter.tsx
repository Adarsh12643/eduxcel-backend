import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../shared/Logo';
import { Brain, GraduationCap, Users, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function FrontendFooter() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bg = isDark ? '#0d1117' : '#f4f7f9';
  const surface = isDark ? '#161b22' : '#ffffff';
  const border = isDark ? '#30363d' : '#e2e8f0';
  const text = isDark ? '#e6edf3' : '#0B1E4A';
  const muted = isDark ? '#8b949e' : '#64748b';

  const platformLinks = [
    { label: 'Student Portal', action: () => navigate('/auth?role=student') },
    { label: 'Faculty Portal', action: () => navigate('/auth?role=faculty') },
    { label: 'AI Intelligence', action: () => navigate('/auth?role=student') },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', action: () => alert('Privacy Policy page coming soon.') },
    { label: 'Terms of Service', action: () => alert('Terms of Service page coming soon.') },
  ];

  return (
    <footer
      style={{
        background: surface,
        borderTop: `1px solid ${border}`,
        padding: '64px 24px 24px',
        marginTop: 'auto',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 48,
          marginBottom: 48,
        }}
      >
        <div style={{ gridColumn: 'span 2' }}>
          <Logo size="sm" showText />
          <p style={{ marginTop: 16, color: muted, fontSize: 14, maxWidth: 320, lineHeight: 1.6 }}>
            EduXcel uses AI-powered performance prediction to identify students at risk early and guide them toward the right learning path.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
            {[
              { icon: Brain, label: 'Predictive Modeling' },
              { icon: GraduationCap, label: 'Student Success' },
              { icon: Users, label: 'Faculty Insights' },
              { icon: Sparkles, label: 'AI Intelligence' },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 999,
                  background: isDark ? 'rgba(53,103,251,0.08)' : '#eef3ff',
                  border: `1px solid ${isDark ? 'rgba(53,103,251,0.2)' : '#c6d6ff'}`,
                  fontSize: 11,
                  fontWeight: 700,
                  color: isDark ? '#8aaaff' : '#0047BA',
                }}
              >
                <feature.icon style={{ width: 14, height: 14 }} />
                <span className="hidden sm:inline">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4
            style={{
              fontWeight: 800,
              color: text,
              marginBottom: 20,
              fontSize: 13,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Platform
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {platformLinks.map((link, i) => (
              <button
                key={i}
                onClick={link.action}
                style={{
                  background: 'none',
                  border: 'none',
                  color: muted,
                  textDecoration: 'none',
                  fontSize: 14,
                  textAlign: 'left',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color 0.2s',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0047BA')}
                onMouseLeave={(e) => (e.currentTarget.style.color = muted)}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4
            style={{
              fontWeight: 800,
              color: text,
              marginBottom: 20,
              fontSize: 13,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Legal
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {legalLinks.map((link, i) => (
              <button
                key={i}
                onClick={link.action}
                style={{
                  background: 'none',
                  border: 'none',
                  color: muted,
                  textDecoration: 'none',
                  fontSize: 14,
                  textAlign: 'left',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color 0.2s',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0047BA')}
                onMouseLeave={(e) => (e.currentTarget.style.color = muted)}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          borderTop: `1px solid ${border}`,
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <p style={{ color: muted, fontSize: 13, fontWeight: 500 }}>
          © {new Date().getFullYear()} EduXcel. All rights reserved.
        </p>
        <p
          style={{
            color: isDark ? '#5580ff' : '#0047BA',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            opacity: 0.7,
          }}
        >
          Learn Today • Excel Tomorrow • Succeed Forever
        </p>
      </div>
    </footer>
  );
}
