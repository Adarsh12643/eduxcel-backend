import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, BookOpen, Target, Sparkles, Calculator, User, LogOut, BrainCircuit, ChevronRight, X, Calendar, ClipboardList, Moon, Sun, SlidersHorizontal, Menu, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from '@/components/shared/Logo';
import { cn } from '@/lib/utils';
import XceloChatbot from '@/components/shared/XceloChatbot';
import { XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar, Cell, Line } from 'recharts';
import { useTheme } from '@/context/ThemeContext';
import Performance from './student/Performance';
import Subjects from './student/Subjects';
import RecoveryHub from './student/RecoveryHub';
import GPACalculator from './student/GPACalculator';
import WhatIfSimulation from './student/WhatIfSimulation';
import ProfilePage from './student/Profile';

const performanceData = [
  { name: 'Week 1', score: 65, predicted: 68 },
  { name: 'Week 2', score: 68, predicted: 70 },
  { name: 'Week 3', score: 72, predicted: 74 },
  { name: 'Week 4', score: 70, predicted: 75 },
  { name: 'Week 5', score: 75, predicted: 78 },
  { name: 'Week 6', score: 78, predicted: 82 },
];

function NavItem({ to, icon: Icon, label, collapsed }: { to: string, icon: any, label: string, collapsed: boolean }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium group',
        isActive
          ? 'bg-brand-600 text-white font-semibold shadow-lg shadow-brand-500/25'
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200'
      )}
    >
      <Icon className="flex-shrink-0 transition-transform group-hover:scale-110" style={{ width: 18, height: 18 }} />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function Overview({ userData }: { userData: any }) {
  const navigate = useNavigate();
  const firstName = userData?.name?.split(' ')[0] || 'Student';
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { default: api } = await import('@/lib/api');
        const res = await api.student.getDashboard();
        if (res.success) {
          setDashboardData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse">Loading live data...</div>;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card p-5 rounded-2xl flex flex-col relative overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-white dark:bg-dark-surface border border-slate-100 dark:border-dark-border">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/8 rounded-full -translate-y-4 translate-x-4 group-hover:scale-150 transition-transform duration-500" />
          <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Overall Score</div>
          <div className="flex items-end gap-2 mb-3">
            <div className="text-4xl font-mono-numbers font-black text-brand-900 dark:text-white tracking-tighter">{dashboardData?.overallPerformance || 0}<span className="text-lg text-slate-400">%</span></div>
            <div className="text-xs font-bold text-emerald-600 mb-1 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3" /> Live
            </div>
          </div>
          <div className="h-10 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                <defs><linearGradient id="kpi1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0047BA" stopOpacity={0.25}/><stop offset="95%" stopColor="#0047BA" stopOpacity={0}/></linearGradient></defs>
                <Area type="monotone" dataKey="score" stroke="#0047BA" strokeWidth={2} fill="url(#kpi1)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="card p-5 rounded-2xl flex flex-col relative overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-white dark:bg-dark-surface border border-slate-100 dark:border-dark-border">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/8 rounded-full -translate-y-4 translate-x-4 group-hover:scale-150 transition-transform duration-500" />
          <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Current SGPA</div>
          <div className="text-4xl font-mono-numbers font-black text-brand-900 dark:text-white tracking-tighter mb-3">{dashboardData?.currentSGPA || 'N/A'}<span className="text-lg text-slate-400">/10</span></div>
          <div className="mt-auto flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 48 48" className="-rotate-90">
              <circle cx="24" cy="24" r="20" fill="none" stroke="#e2e8f0" strokeWidth="6" />
              <motion.circle initial={{ strokeDashoffset: 125 }} animate={{ strokeDashoffset: 15 }} transition={{ duration: 1.5, delay: 0.5 }}
                cx="24" cy="24" r="20" fill="none" stroke="#a855f7" strokeWidth="6" strokeDasharray="125" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target <span className="text-purple-600 font-bold">{dashboardData?.targetSGPA || '8.0'}</span></span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="card p-5 rounded-2xl flex flex-col relative overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-white dark:bg-dark-surface border border-slate-100 dark:border-dark-border">
          <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2 flex justify-between items-center">
            Academic Risk
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
          </div>
          <div className={cn("text-3xl font-black tracking-tight mb-3 uppercase", dashboardData?.academicRisk === 'High' ? 'text-red-600' : dashboardData?.academicRisk === 'Medium' ? 'text-amber-500' : 'text-emerald-600')}>{dashboardData?.academicRisk || 'LOW'}</div>
          <div className="mt-auto">
            <div className="text-xs font-semibold text-slate-400 mb-2">ML Analysis Active</div>
            <div className="flex gap-1.5 h-1.5 w-full">
              <div className={cn("h-full flex-1 rounded-full", dashboardData?.academicRisk === 'High' ? 'bg-red-500' : dashboardData?.academicRisk === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500')} />
              <div className="h-full flex-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
              <div className="h-full flex-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="card p-5 rounded-2xl flex flex-col relative overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-white dark:bg-dark-surface border border-slate-100 dark:border-dark-border">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/8 rounded-full -translate-y-4 translate-x-4 group-hover:scale-150 transition-transform duration-500" />
          <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Attendance</div>
          <div className="text-4xl font-mono-numbers font-black text-brand-900 dark:text-white tracking-tighter mb-3">{dashboardData?.attendance || 0}<span className="text-lg text-slate-400">%</span></div>
          <div className="h-10 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{v:100},{v:80},{v:100},{v:60},{v:100}]} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                <Bar dataKey="v" radius={[3,3,0,0]} barSize={10}>
                  {[100,80,100,60,100].map((v,i) => <Cell key={i} fill={v===100?'#FF8C00':'#fed7aa'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="lg:col-span-2 bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">Your Academic Intelligence</h3>
            <select className="bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500 dark:text-white">
              <option>Semester</option>
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore2)" name="Actual Score" />
                <Line type="monotone" dataKey="predicted" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" dot={false} name="AI Predicted" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 p-4 rounded-xl border border-brand-100 dark:border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/10 flex gap-4 items-start">
            <div className="p-2 bg-brand-100 dark:bg-brand-500/20 rounded-lg text-brand-600 dark:text-brand-300 shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-brand-900 dark:text-brand-100 mb-1">AI Insight</h4>
              <p className="text-sm text-brand-700/80 dark:text-brand-300/80 leading-relaxed">
                Your performance is improving, but <span className="font-semibold">DBMS</span> and <span className="font-semibold">Mathematics</span> require additional attention to secure your target B+ grade.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm flex flex-col hover:shadow-md transition-all"
        >
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-6">Academic Risk Analysis</h3>

          <div className="flex flex-col items-center justify-center mb-8 relative">
            <div className="w-48 h-24 relative overflow-hidden flex justify-center">
              <div className="w-48 h-48 rounded-full border-[16px] border-slate-100 dark:border-slate-700 absolute top-0" />
              <div className="w-48 h-48 rounded-full border-[16px] border-transparent border-t-red-500 border-r-red-500 absolute top-0 rotate-45 transition-all duration-1000" />
              <div className="absolute bottom-0 flex flex-col items-center">
                <span className="text-3xl font-bold text-red-600 dark:text-red-400 font-display">HIGH</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Current Risk</span>
              </div>
            </div>
          </div>

          <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">Why is my risk level high?</h4>
          <div className="space-y-4 flex-1">
            <div className="p-3 rounded-xl border border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-red-900 dark:text-red-300">Attendance — 68%</p>
                <p className="text-xs text-red-700/80 dark:text-red-400/80 mt-0.5">Impact: Critical</p>
              </div>
              <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
            </div>
            <div className="p-3 rounded-xl border border-amber-100 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">Internal Marks — 54%</p>
                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-0.5">Impact: High</p>
              </div>
              <TrendingUp className="w-4 h-4 text-amber-500 rotate-180" />
            </div>
          </div>

          <button
            onClick={() => navigate('/student/recovery')}
            className="mt-6 w-full py-2.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 font-semibold rounded-xl transition-colors border border-red-200 dark:border-red-800"
          >
            View Recovery Plan
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function SchedulePage() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const schedule: Record<string, { time: string; subject: string; room: string; type: string }[]> = {
    Monday: [{ time: '9:00 AM', subject: 'DBMS', room: 'Lab 3', type: 'Lab' }, { time: '11:00 AM', subject: 'Mathematics III', room: 'Room 201', type: 'Lecture' }],
    Tuesday: [{ time: '10:00 AM', subject: 'Operating Systems', room: 'Room 105', type: 'Lecture' }],
    Wednesday: [{ time: '9:00 AM', subject: 'Computer Networks', room: 'Room 202', type: 'Lecture' }, { time: '2:00 PM', subject: 'DBMS', room: 'Room 201', type: 'Lecture' }],
    Thursday: [{ time: '11:00 AM', subject: 'Mathematics III', room: 'Room 201', type: 'Lecture' }],
    Friday: [{ time: '9:00 AM', subject: 'Operating Systems', room: 'Lab 2', type: 'Lab' }, { time: '1:00 PM', subject: 'Computer Networks', room: 'Room 105', type: 'Lecture' }],
  };
  const typeColor: Record<string, string> = {
    Lab: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800',
    Lecture: 'bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 border-brand-100 dark:border-brand-700',
  };
  const dayColors = ['#0047BA', '#3567fb', '#00A3E0', '#7C3AED', '#FF8C00'];
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Class Schedule</h2><p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Your weekly timetable for Semester 6.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map((day, i) => (
          <motion.div key={day} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden hover:shadow-md transition-all group">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-dark-border flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${dayColors[i]}10, ${dayColors[i]}05)` }}>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{day}</p>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: dayColors[i] }} />
            </div>
            <div className="p-3 space-y-2">
              {(schedule[day] || []).map((cls, j) => (
                <motion.div key={j} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 + j * 0.05 }}
                  className={cn('p-3 rounded-xl border text-xs transition-all hover:shadow-sm cursor-pointer', typeColor[cls.type])}>
                  <p className="font-bold">{cls.subject}</p>
                  <p className="opacity-70 mt-0.5">{cls.time} • {cls.room}</p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded-md bg-white/50 dark:bg-black/20 font-semibold text-[10px]">{cls.type}</span>
                </motion.div>
              ))}
              {!(schedule[day] || []).length && <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">No classes</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AssignmentsPage() {
  const assignments = [
    { title: 'DBMS ER Diagram', subject: 'DBMS', due: '2 days', priority: 'High', status: 'pending' },
    { title: 'OS Process Scheduling Report', subject: 'Operating Systems', due: '5 days', priority: 'Medium', status: 'in_progress' },
    { title: 'Math III Problem Set 4', subject: 'Mathematics III', due: '1 day', priority: 'High', status: 'pending' },
    { title: 'Networks Lab Report', subject: 'Computer Networks', due: '7 days', priority: 'Low', status: 'submitted' },
  ];
  const statusStyle: Record<string, string> = {
    pending: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800',
    in_progress: 'bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 border-brand-100 dark:border-brand-700',
    submitted: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
  };
  const priorityStyle: Record<string, string> = {
    High: 'text-red-600 dark:text-red-400', Medium: 'text-amber-600 dark:text-amber-400', Low: 'text-emerald-600 dark:text-emerald-400',
  };
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Assignments</h2><p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track and manage your pending assignments.</p></div>
      <div className="space-y-3">
        {assignments.map((a, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-dark-surface p-5 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{a.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{a.subject} • Due in {a.due}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`text-xs font-bold ${priorityStyle[a.priority]}`}>{a.priority}</span>
              <span className={cn('px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border', statusStyle[a.status])}>
                {a.status.replace('_', ' ')}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const user = localStorage.getItem('eduxcel_user');
    if (user) setUserData(JSON.parse(user));
  }, []);

  const getHeaderInfo = () => {
    if (location.pathname.includes('recovery')) return { title: 'Recovery Hub', subtitle: 'Your personalized path to academic improvement.' };
    return { title: location.pathname.includes('/student/') && !location.pathname.includes('dashboard') ? '' : `${getGreeting()}, ${userData?.name?.split(' ')[0] || 'Student'} 👋`, subtitle: "Here's how your academic journey is progressing." };
  };

  const headerInfo = getHeaderInfo();

  const handleLogout = () => {
    localStorage.removeItem('eduxcel_token');
    localStorage.removeItem('eduxcel_user');
    navigate('/auth');
  };

  const sidebarW = collapsed ? 80 : 240;
  const sidebarPad = collapsed ? 12 : 20;
  const userName = userData?.name || 'Loading...';
  const userEmail = userData?.email || '';
  const initials = userName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="min-h-screen font-sans relative overflow-hidden" style={{ background: 'var(--page-bg)', color: 'var(--page-text)', transition: 'background 0.3s, color 0.3s' }}>
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(53,103,251,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(255,140,0,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* Sidebar — fixed */}
      <aside
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        className={cn(
          "glass-panel border-r transition-all duration-300 flex flex-col z-20 fixed top-3 left-3 bottom-3 rounded-2xl overflow-hidden",
          collapsed ? "w-20 p-3" : "w-60 p-5"
        )}>
        <div className={cn("mb-8 flex", collapsed ? "justify-center" : "items-center")}>
          <Logo size="md" showText={!collapsed} />
        </div>

        <nav className="flex-1 space-y-1.5 pr-2 overflow-y-auto scrollbar-hide">
          <NavItem to="/student/dashboard" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} />
          <NavItem to="/student/schedule" icon={Calendar} label="Schedule" collapsed={collapsed} />
          <NavItem to="/student/assignments" icon={ClipboardList} label="Assignments" collapsed={collapsed} />
          <NavItem to="/student/performance" icon={TrendingUp} label="Performance" collapsed={collapsed} />
          <NavItem to="/student/subjects" icon={BookOpen} label="Subjects" collapsed={collapsed} />
          <NavItem to="/student/recovery" icon={Target} label="Recovery Hub" collapsed={collapsed} />
          <NavItem to="/student/whatif" icon={SlidersHorizontal} label="What If?" collapsed={collapsed} />
          <NavItem to="/student/calculator" icon={Calculator} label="GPA Calc" collapsed={collapsed} />
          <NavItem to="/student/profile" icon={User} label="Profile" collapsed={collapsed} />
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          {!collapsed && (
            <div className="p-3 bg-white/50 dark:bg-dark-elevated/50 rounded-xl border border-white dark:border-white/10 mb-4 shadow-inner-crisp dark:shadow-inner-crisp">
              <p className="text-[10px] font-black tracking-widest text-brand-600 dark:text-brand-400 uppercase mb-1">Xcelo Core</p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">"Learn Today • Excel Tomorrow • Succeed Forever"</p>
            </div>
          )}

          <div className={cn("flex items-center", collapsed ? "flex-col gap-2" : "gap-3 justify-between")}>
            <div className={cn("flex items-center gap-3 min-w-0", collapsed && "justify-center")}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-bold text-xs border-2 border-white dark:border-slate-600 shadow-sm flex-shrink-0">
                {initials}
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-brand-900 dark:text-white tracking-tight truncate">{userName}</p>
                  <p className="text-[10px] text-brand-500 dark:text-brand-400 font-mono tracking-tighter uppercase truncate">{userEmail}</p>
                </div>
              )}
            </div>
            <div className={cn("flex items-center gap-1", collapsed ? "flex-col" : "flex-row")}>
              {!collapsed && (
                <button onClick={toggleTheme} className="text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/20" title="Toggle theme">
                  {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                </button>
              )}
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Logout">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content — offset by sidebar width with proper gap */}
      <main
        className="relative z-10"
        style={{ marginLeft: sidebarW + sidebarPad, transition: 'margin-left 0.3s', padding: '12px 24px 12px 4px' }}
      >
        {/* Header — sticky */}
        <header className="glass-panel h-16 flex items-center justify-between px-6 z-10 flex-shrink-0 rounded-2xl mb-5 sticky top-3">
          <div className="flex items-center gap-4">
            <button onClick={() => setCollapsed(!collapsed)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              {collapsed ? <Menu style={{ width: 18, height: 18 }} /> : <ChevronLeft style={{ width: 18, height: 18 }} />}
            </button>
            {headerInfo.title && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{headerInfo.title}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">{headerInfo.subtitle}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {userData?.streak && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-500/30 rounded-full shadow-sm"
              >
                <span className="text-lg animate-pulse">🔥</span>
                <span className="text-sm font-black text-orange-600 dark:text-orange-400">{userData.streak} Day Streak!</span>
              </motion.div>
            )}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wide">AI LIVE</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="pb-5">
          <div className="max-w-6xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Overview userData={userData} />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="assignments" element={<AssignmentsPage />} />
              <Route path="performance" element={<Performance />} />
              <Route path="subjects" element={<Subjects />} />
              <Route path="recovery" element={<RecoveryHub />} />
              <Route path="calculator" element={<GPACalculator />} />
              <Route path="whatif" element={<WhatIfSimulation />} />
              <Route path="profile" element={<ProfilePage userData={userData} />} />
              <Route path="*" element={<Overview userData={userData} />} />
            </Routes>
          </div>

          <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400 w-full">
            © {new Date().getFullYear()} EduXcel AI. <span className="font-medium">Learn Today • Excel Tomorrow • Succeed Forever.</span>
          </footer>
        </div>
      </main>

      {/* Floating Action Button */}
      <ChatbotButton isAIOpen={isAIOpen} setIsAIOpen={setIsAIOpen} roleContext="student" />
    </div>
  );
}