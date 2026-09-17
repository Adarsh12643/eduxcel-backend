import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight, Sparkles, Brain, BarChart3, Target, AlertTriangle, Users, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import FrontendNavbar from '@/components/layout/FrontendNavbar';
import FrontendFooter from '@/components/layout/FrontendFooter';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bg       = isDark ? '#0d1117' : '#f4f7f9';
  const surface  = isDark ? '#161b22' : '#ffffff';
  const elevated = isDark ? '#21262d' : '#f8fafc';
  const border   = isDark ? '#30363d' : '#e2e8f0';
  const text      = isDark ? '#e6edf3' : '#0B1E4A';
  const muted     = isDark ? '#8b949e' : '#64748b';
  const mutedBg   = isDark ? '#21262d' : '#f1f5f9';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: bg, color: text, transition: 'background 0.3s, color 0.3s', position: 'relative' }}>

      {/* Theme Toggle — moved to navbar */}

      {/* Ambient blobs — fixed so they don't affect page scroll or footer */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }} aria-hidden="true">
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: isDark ? 'radial-gradient(circle, rgba(53,103,251,0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(53,103,251,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: isDark ? 'radial-gradient(circle, rgba(255,140,0,0.1) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(255,140,0,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* Navbar */}
      <FrontendNavbar />

      {/* Hero */}
      <main style={{ flex: 1, padding: '120px 24px 60px', maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: isDark ? 'rgba(53,103,251,0.15)' : 'rgba(53,103,251,0.08)', border: `1px solid ${isDark ? 'rgba(53,103,251,0.3)' : 'rgba(53,103,251,0.2)'}`, color: isDark ? '#8aaaff' : '#0047BA', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 40 }}>
            <Sparkles style={{ width: 14, height: 14, color: '#FF8C00' }} />
            EduXcel Core • v1.0 Intelligence
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 32, color: text }}>
            Turn Academic Risk Into<br />
            <span style={{ background: 'linear-gradient(135deg, #0047BA, #3567fb, #00A3E0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Academic Recovery.
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: muted, marginBottom: 48, maxWidth: 700, margin: '0 auto 48px', lineHeight: 1.7 }}>
            EduXcel uses AI-powered performance prediction to identify students at risk early and guide them toward the right learning path.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 64 }}>
            <button onClick={() => navigate('/auth?mode=register')}
              style={{ background: '#0047BA', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: 999, fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(0,71,186,0.35)', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
              Get Started <ArrowUpRight style={{ width: 20, height: 20 }} />
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: surface, color: text, border: `1px solid ${border}`, padding: '16px 32px', borderRadius: 999, fontWeight: 700, fontSize: 16, cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
              Explore EduXcel
            </button>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
            style={{ fontSize: 11, color: isDark ? '#5580ff' : '#0047BA', fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.7 }}>
            Learn Today • Excel Tomorrow • Succeed Forever
          </motion.p>
        </div>

        {/* Hero Dashboard Preview */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: [0, -15, 0] }} transition={{ opacity: { duration: 0.7, delay: 0.4 }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
            style={{ marginTop: 80, maxWidth: 960, margin: '80px auto 0', padding: '0 24px' }}>
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 24, overflow: 'hidden', boxShadow: isDark ? '0 24px 64px rgba(0,0,0,0.5)' : '0 24px 64px rgba(11,30,74,0.12)' }}>
              {/* Top bar */}
              <div style={{ height: 4, background: 'linear-gradient(90deg, #0047BA, #3567fb, #00A3E0)' }} />
              <div style={{ display: 'flex' }}>
                {/* Dashboard full content */}
                <div style={{ flex: 1, padding: 32, background: elevated }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                    {[
                      { val: '8.4', label: 'Predicted GPA', color: '#0047BA' },
                      { val: 'Low', label: 'Risk Level', color: '#10b981' },
                      { val: '85%', label: 'Attendance', color: '#3b82f6' },
                      { val: 'DBMS', label: 'Focus Area', color: '#f59e0b' },
                    ].map((stat, i) => (
                      <motion.div key={i} 
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 16, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: 26, fontWeight: 900, color: stat.color, marginBottom: 4 }}>{stat.val}</div>
                        <div style={{ fontSize: 12, color: muted, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                  {/* Dynamic moving chart bars */}
                  <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 20, height: 200, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                    {[40,55,45,60,75,65,80,85].map((h, i) => (
                      <motion.div key={i} 
                        initial={{ height: 0 }} 
                        animate={{ height: [`${h}%`, `${h + 15}%`, `${h - 10}%`, `${h}%`] }} 
                        transition={{ duration: 4 + i % 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                        style={{ flex: 1, background: i % 2 === 0 ? '#0047BA' : (isDark ? '#30363d' : '#e2e8f0'), borderRadius: '6px 6px 0 0', minWidth: 0, boxShadow: '0 0 10px rgba(0,71,186,0.1)' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features */}
        <section id="features" style={{ padding: '80px 0 60px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: text, marginBottom: 16 }}>Core Architecture</h2>
            <p style={{ color: muted, fontSize: 18, maxWidth: 600, margin: '0 auto' }}>Sophisticated modules designed to support students and empower faculty.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
            {[
              { title: 'Predictive Modeling', icon: Brain, desc: 'Advanced models map academic trajectories before risk thresholds are breached.' },
              { title: 'Real-Time Telemetry', icon: AlertTriangle, desc: 'Automated signal detection highlights struggling cohorts for immediate intervention.' },
              { title: 'Dynamic Recovery', icon: Target, desc: 'Custom study hubs and planners algorithmically adjust to individual failure points.' },
              { title: 'Holistic Analytics', icon: BarChart3, desc: 'Track attendance, assessment deltas, and behavioral metrics in one dashboard.' },
              { title: 'Syllabus AI', icon: Sparkles, desc: 'Students query an AI fine-tuned on their course architecture and materials.' },
              { title: 'Faculty Command', icon: Users, desc: 'High-level view for professors to monitor class health and streamline grading.' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                style={{ background: surface, border: `1px solid ${border}`, borderRadius: 20, padding: 32, cursor: 'default', transition: 'box-shadow 0.2s, transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,71,186,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: isDark ? 'rgba(53,103,251,0.15)' : '#eef3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <f.icon style={{ width: 22, height: 22, color: '#0047BA' }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: text, marginBottom: 10, letterSpacing: '-0.02em' }}>{f.title}</h3>
                <p style={{ color: muted, lineHeight: 1.6, fontSize: 14 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it Works */}
        <section id="architecture" style={{ padding: '60px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: text, marginBottom: 16 }}>Data Pipeline</h2>
            <p style={{ color: muted, fontSize: 18, maxWidth: 600, margin: '0 auto' }}>A seamless flow from raw data to actionable student success.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 48, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            {[
              { step: '01', title: 'Data Aggregation', desc: 'Syncs attendance, internal marks, and engagement data continuously.' },
              { step: '02', title: 'AI Analysis', desc: 'Models identify patterns, predict final grades and flag anomalies.' },
              { step: '03', title: 'Proactive Action', desc: 'Triggers recovery workflows and alerts for faculty intervention.' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div style={{ width: 80, height: 80, borderRadius: 20, background: isDark ? 'rgba(53,103,251,0.12)' : '#eef3ff', border: `2px solid ${isDark ? 'rgba(53,103,251,0.3)' : '#c6d6ff'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 28, fontWeight: 900, color: '#0047BA', fontFamily: 'JetBrains Mono, monospace' }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: text, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: muted, lineHeight: 1.6 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Faculty CTA */}
        <section id="faculty-console" style={{ background: elevated, border: `1px solid ${border}`, borderRadius: 32, padding: '60px 40px', margin: '24px 0', position: 'relative', overflow: 'hidden', boxShadow: isDark ? '0 24px 64px rgba(0,0,0,0.3)' : '0 24px 64px rgba(11,30,74,0.05)' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 400, height: 400, borderRadius: '50%', background: isDark ? 'radial-gradient(circle, rgba(53,103,251,0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(53,103,251,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 300, height: 300, borderRadius: '50%', background: isDark ? 'radial-gradient(circle, rgba(255,140,0,0.1) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(255,140,0,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', maxWidth: 1000, margin: '0 auto' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: isDark ? 'rgba(53,103,251,0.15)' : '#eef3ff', border: `1px solid ${isDark ? 'rgba(53,103,251,0.3)' : '#c6d6ff'}`, color: '#0047BA', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24 }}>
                <Users style={{ width: 14, height: 14 }} /> Faculty Console
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, color: text, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>Command Your Classroom.</h2>
              <p style={{ color: muted, fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
                Professors shouldn't wait for final exams to know who is struggling. EduXcel gives faculty a real-time command center.
              </p>
              {['Automated cohort performance telemetry', 'One-click algorithmic risk profiling', 'Integrated recovery workflows'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: isDark ? 'rgba(53,103,251,0.15)' : '#eef3ff', border: `1px solid ${isDark ? 'rgba(53,103,251,0.3)' : '#c6d6ff'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle2 style={{ width: 14, height: 14, color: '#0047BA' }} />
                  </div>
                  <span style={{ color: text, fontWeight: 500 }}>{item}</span>
                </div>
              ))}
              <button onClick={() => navigate('/auth?role=faculty')}
                style={{ marginTop: 16, background: '#0047BA', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 999, fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'transform 0.2s', boxShadow: '0 4px 16px rgba(0,71,186,0.3)' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                Launch Console <ArrowRight style={{ width: 18, height: 18 }} />
              </button>
            </div>
            
            <div style={{ position: 'relative', height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Central Glowing AI Core */}
              <motion.div
                animate={{ boxShadow: ['0 0 20px #0047BA', '0 0 60px #00A3E0', '0 0 20px #0047BA'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, #0047BA, #00A3E0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10 }}
              >
                <Brain style={{ color: 'white', width: 44, height: 44 }} />
              </motion.div>

              {/* Pulsing Concentric Radar Rings */}
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 3.5], opacity: [0.6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: 'easeOut' }}
                  style={{ position: 'absolute', width: 90, height: 90, borderRadius: '50%', border: `2px solid ${isDark ? '#3567fb' : '#0047BA'}` }}
                />
              ))}

              {/* Floating Data Nodes (Students) */}
              {[
                { top: '15%', left: '15%', size: 48, delay: 0, color: '#10b981', icon: <CheckCircle2 size={20} color="#10b981" /> },
                { top: '75%', left: '10%', size: 40, delay: 1, color: '#f59e0b', icon: <AlertTriangle size={16} color="#f59e0b" /> },
                { top: '10%', left: '75%', size: 56, delay: 2, color: '#ef4444', icon: <Target size={24} color="#ef4444" /> },
                { top: '85%', left: '70%', size: 44, delay: 0.5, color: '#3b82f6', icon: <BarChart3 size={18} color="#3b82f6" /> }
              ].map((node, i) => (
                <motion.div
                  key={`node-${i}`}
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 3 + i, repeat: Infinity, delay: node.delay, ease: 'easeInOut' }}
                  style={{ position: 'absolute', top: node.top, left: node.left, width: node.size, height: node.size, borderRadius: 16, background: surface, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 24px ${node.color}20` }}
                >
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: node.delay }}>
                    {node.icon}
                  </motion.div>
                </motion.div>
              ))}

              {/* Connecting SVG Lines */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
                <motion.line x1="50%" y1="50%" x2="25%" y2="25%" stroke={isDark ? "rgba(53,103,251,0.2)" : "rgba(0,71,186,0.1)"} strokeWidth="2" strokeDasharray="4" animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
                <motion.line x1="50%" y1="50%" x2="20%" y2="80%" stroke={isDark ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.1)"} strokeWidth="2" strokeDasharray="4" animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1 }} />
                <motion.line x1="50%" y1="50%" x2="80%" y2="20%" stroke={isDark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.1)"} strokeWidth="2" strokeDasharray="4" animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 2 }} />
                <motion.line x1="50%" y1="50%" x2="75%" y2="85%" stroke={isDark ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.1)"} strokeWidth="2" strokeDasharray="4" animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.5 }} />
              </svg>
            </div>
          </div>
        </section>
      
        {/* Contact Us */}
        <section id="contact" style={{ padding: '60px 0', borderTop: `1px solid ${border}` }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16 }}>Get in Touch</h2>
            <p style={{ color: muted, fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
              Have questions about EduXcel? Our team is here to help you transform your academic institution.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, maxWidth: 900, margin: '0 auto' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              style={{ background: surface, border: `1px solid ${border}`, borderRadius: 24, padding: 40, boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.2)' : '0 10px 40px rgba(53,103,251,0.05)' }}
            >
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Send us a message</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: muted, marginBottom: 8 }}>Name</label>
                  <input type="text" placeholder="John Doe" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${border}`, background: bg, color: text, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: muted, marginBottom: 8 }}>Email</label>
                  <input type="email" placeholder="john@university.edu" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${border}`, background: bg, color: text, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: muted, marginBottom: 8 }}>Message</label>
                  <textarea rows={4} placeholder="How can we help?" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${border}`, background: bg, color: text, outline: 'none', resize: 'vertical' }} />
                </div>
                <button 
                  onClick={() => alert("Message sent! We'll get back to you shortly.")}
                  style={{ width: '100%', padding: 14, marginTop: 8, background: '#0047BA', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(0,71,186,0.3)' }}
                >
                  Send Message <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32 }}>
              <motion.div whileHover={{ x: 5, scale: 1.01 }} transition={{ duration: 0.2 }} style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: isDark ? 'rgba(53,103,251,0.1)' : '#eef3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0047BA' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Call Us</h4>
                  <p style={{ color: muted, fontSize: 14 }}>Mon-Fri from 8am to 5pm.</p>
                  <a href="tel:+11234567890" style={{ color: '#0047BA', fontWeight: 600, textDecoration: 'none', fontSize: 15, display: 'block', marginTop: 4 }}>+1 (123) 456-7890</a>
                </div>
              </motion.div>
              <motion.div whileHover={{ x: 5, scale: 1.01 }} transition={{ duration: 0.2 }} style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: isDark ? 'rgba(53,103,251,0.1)' : '#eef3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0047BA' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                </div>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Email Us</h4>
                  <p style={{ color: muted, fontSize: 14 }}>Our friendly team is here to help.</p>
                  <a href="mailto:hello@eduxcel.com" style={{ color: '#0047BA', fontWeight: 600, textDecoration: 'none', fontSize: 15, display: 'block', marginTop: 4 }}>hello@eduxcel.com</a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <FrontendFooter />
    </div>
  );
}
