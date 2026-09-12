import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import Logo from '../shared/Logo';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string;
  sectionId?: string;
}

const navItems: NavItem[] = [
  { label: 'Features', href: '#features', sectionId: 'features' },
  { label: 'Architecture', href: '#architecture', sectionId: 'architecture' },
  { label: 'Faculty Console', href: '#faculty-console', sectionId: 'faculty-console' },
];

export default function FrontendNavbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bg = isDark ? '#0d1117' : '#ffffff';
  const border = isDark ? 'rgba(48,54,61,0.5)' : 'rgba(226,232,240,0.5)';
  const text = isDark ? '#8b949e' : '#64748b';
  const activeText = '#0047BA';

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        background: scrolled
          ? (isDark ? 'rgba(13,17,23,0.92)' : 'rgba(255,255,255,0.92)')
          : (isDark ? 'rgba(13,17,23,0.65)' : 'rgba(255,255,255,0.65)'),
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${border}`,
        padding: scrolled ? '12px 0' : '20px 0',
        transition: 'all 0.3s',
      }}
    >
      <div
        style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Logo />

        <div
          ref={navRef}
          style={{ display: 'flex', alignItems: 'center', gap: 36, position: 'relative' }}
        >
          {navItems.map((item, i) => (
            <a
              key={i}
              href={item.href}
              onClick={(e) => {
                if (item.sectionId) {
                  e.preventDefault();
                  const el = document.getElementById(item.sectionId);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              style={{
                color: activeIndex === i ? activeText : text,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                padding: '8px 4px',
                transition: 'color 0.3s',
                position: 'relative',
                letterSpacing: '0.01em',
              }}
            >
              {item.label}
              {activeIndex === i && (
                <motion.div
                  layoutId="navbar-underline"
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    right: 0,
                    height: 2.5,
                    borderRadius: 999,
                    background: 'linear-gradient(90deg, #0047BA, #00A3E0)',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: text,
              transition: 'color 0.2s',
            }}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun style={{ width: 18, height: 18, color: '#fbbf24' }} /> : <Moon style={{ width: 18, height: 18, color: '#475569' }} />}
          </button>
          <button
            onClick={() => navigate('/auth')}
            style={{
              background: 'none',
              border: 'none',
              color: text,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14,
              padding: '8px 4px',
              transition: 'color 0.2s',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/auth')}
            style={{
              background: '#0047BA',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 16px rgba(0,71,186,0.3)',
              transition: 'background 0.2s',
            }}
          >
            Access Platform
          </button>
        </div>
      </div>
    </nav>
  );
}
