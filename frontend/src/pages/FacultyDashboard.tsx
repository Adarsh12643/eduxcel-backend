import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileBarChart, Settings, LogOut, Search, Filter, ChevronRight, Play, Sparkles, Calendar, ClipboardList, BookOpen, Moon, Sun, X, Menu, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from '@/components/shared/Logo';
import { cn } from '@/lib/utils';
import FacultySchedule from './faculty/FacultySchedule';
import FacultyAssignments from './faculty/FacultyAssignments';
import FacultyAnalytics from './faculty/FacultyAnalytics';
import FacultyProfile from './faculty/FacultyProfile';
import AllStudents from './faculty/AllStudents';
import XceloChatbot from '@/components/shared/XceloChatbot';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

const students = [
  { id: '1', name: 'Alex Johnson', attendance: 68, internal: 54, predicted: 'C+', risk: 'High', weak: ['DBMS', 'Math III'] },
  { id: '2', name: 'Sarah Williams', attendance: 92, internal: 88, predicted: 'A', risk: 'Low', weak: [] },
  { id: '3', name: 'Michael Chen', attendance: 85, internal: 75, predicted: 'B+', risk: 'Low', weak: ['OS'] },
  { id: '4', name: 'Emma Davis', attendance: 72, internal: 60, predicted: 'B', risk: 'Medium', weak: ['DBMS'] },
  { id: '5', name: 'James Wilson', attendance: 65, internal: 45, predicted: 'C', risk: 'High', weak: ['Math III', 'Networks'] },
];

const riskDistribution = [
  { name: 'Low Risk', value: 182, color: '#10b981' },
  { name: 'Medium Risk', value: 41, color: '#f59e0b' },
  { name: 'High Risk', value: 17, color: '#ef4444' },
];

function FacultyOverview() {
  const navigate = useNavigate();
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { default: api } = await import('@/lib/api');
        const res = await api.faculty.getAllStudents();
        if (res.success && res.data) {
          setStudentsList(res.data);
        } else {
          setStudentsList(students); // fallback to mock if api fails/empty for now
        }
      } catch (err) {
        setStudentsList(students);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const highRisk = studentsList.filter(s => s.risk === 'High' || s.riskLevel === 'High').length;
  const medRisk = studentsList.filter(s => s.risk === 'Medium' || s.riskLevel === 'Medium').length;
  const lowRisk = studentsList.filter(s => s.risk === 'Low' || s.riskLevel === 'Low').length;

  const liveRiskDistribution = [
    { name: 'Low Risk', value: lowRisk || 1, color: '#10b981' },
    { name: 'Medium Risk', value: medRisk || 0, color: '#f59e0b' },
    { name: 'High Risk', value: highRisk || 0, color: '#ef4444' },
  ];

  if (loading) return <div className="p-10 text-center animate-pulse">Loading live student data...</div>;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: '240', color: 'text-brand-900 dark:text-white', icon: '👥' },
          { label: 'Low Risk', value: '182', color: 'text-emerald-500', icon: '🟢' },
          { label: 'Moderate Risk', value: '41', color: 'text-amber-500', icon: '🟡' },
          { label: 'High Risk', value: '17', color: 'text-red-500', icon: '🔴' },
          { label: 'Total Students', value: studentsList.length.toString(), color: 'text-brand-900 dark:text-white', icon: '👥' },
          { label: 'Low Risk', value: lowRisk.toString(), color: 'text-emerald-500', icon: '🟢' },
          { label: 'Moderate Risk', value: medRisk.toString(), color: 'text-amber-500', icon: '🟡' },
          { label: 'High Risk', value: highRisk.toString(), color: 'text-red-500', icon: '🔴' },
        ].map((kpi, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={i} className="bg-white dark:bg-dark-surface p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border flex flex-col items-center justify-center text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{kpi.icon}</div>
            <div className={cn("text-3xl font-black mb-1", kpi.color)}>{kpi.value}</div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="lg:col-span-2 bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">Risk Distribution</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={liveRiskDistribution} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} width={100} />
                <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                  {liveRiskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">AI Insights</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
              The ML model has identified <span className="font-bold text-red-600 dark:text-red-400">{highRisk} students</span> at high risk of failing DBMS this semester. Primary contributing factor is low attendance (&lt; 70%).
              The ML model has identified <span className="font-bold text-red-600 dark:text-red-400">{highRisk} students</span> at high risk of failing this semester. Primary contributing factor is low attendance (&lt; 70%).
            </p>
          </div>
          <button onClick={() => navigate('/faculty/students')} className="w-full py-2.5 bg-brand-50 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-500/30 font-semibold rounded-xl transition-colors border border-brand-200 dark:border-brand-500/30">
            View High Risk Cohort
          </button>
        </motion.div>
      </div>

      {/* Student List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden hover:shadow-md transition-all">
        <div className="p-6 border-b border-slate-100 dark:border-dark-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">Students Requiring Attention</h3>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search students..." className="pl-9 pr-4 py-2 border border-slate-200 dark:border-dark-border rounded-lg text-sm outline-none focus:border-brand-500 w-full sm:w-64 bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white placeholder:text-slate-400" />
            </div>
            <button className="p-2 border border-slate-200 dark:border-dark-border rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-dark-elevated/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-4 pl-6">Student</th>
                <th className="p-4">Attendance</th>
                <th className="p-4">Internal</th>
                <th className="p-4">Predicted Grade</th>
                <th className="p-4">Risk Level</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {studentsList.slice(0, 5).map((student) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold text-xs">{student.name.charAt(0)}</div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{student.name}</p>
                        {student.weak.length > 0 && <p className="text-xs text-red-500 font-medium">Weak in: {student.weak.join(', ')}</p>}
                        {student.weak?.length > 0 && <p className="text-xs text-red-500 font-medium">Weak in: {student.weak.join(', ')}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-700 dark:text-slate-300">{student.attendance}%</td>
                  <td className="p-4 text-sm font-medium text-slate-700 dark:text-slate-300">{student.internal}%</td>
                  <td className="p-4 text-sm font-medium text-slate-700 dark:text-slate-300">{student.attendance || student.overallAttendance || 0}%</td>
                  <td className="p-4 text-sm font-medium text-slate-700 dark:text-slate-300">{student.internal || student.overallInternal || 0}%</td>
                  <td className="p-4">
                    <span className="font-bold text-slate-900 dark:text-white">{student.predicted}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{student.predicted || student.predictedGrade || 'N/A'}</span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-bold uppercase",
                      student.risk === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                      student.risk === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                      (student.risk || student.riskLevel) === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                      (student.risk || student.riskLevel) === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                      'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    )}>
                      {student.risk}
                      {student.risk || student.riskLevel || 'Low'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => navigate(`/faculty/student/${student.id}`)}
                      className="text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-semibold text-sm flex items-center gap-1"
                    >
                      Analyze <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

function StudentDetail() {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [simAtt, setSimAtt] = useState(68);
  const [simInt, setSimInt] = useState(54);

  const runPrediction = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setShowResult(true);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">AJ</div>
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Alex Johnson</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">B.Tech Computer Science • Semester 5</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm space-y-6 hover:shadow-md transition-all">
          <h3 className="font-bold font-display text-lg text-slate-900 dark:text-white">Input Data / Faculty Entry</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="font-medium text-slate-700 dark:text-slate-300">Attendance</label>
                <span className="font-bold text-brand-600 dark:text-brand-400">{simAtt}%</span>
              </div>
              <input type="range" min="0" max="100" value={simAtt} onChange={(e) => setSimAtt(Number(e.target.value))} className="w-full accent-brand-600" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="font-medium text-slate-700 dark:text-slate-300">Internal Marks</label>
                <span className="font-bold text-brand-600 dark:text-brand-400">{simInt}%</span>
              </div>
              <input type="range" min="0" max="100" value={simInt} onChange={(e) => setSimInt(Number(e.target.value))} className="w-full accent-brand-600" />
            </div>
          </div>

          <button
            onClick={runPrediction}
            disabled={isRunning}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 disabled:opacity-70 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isRunning ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing ML Model...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Run AI Prediction
              </>
            )}
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-slate-900 dark:bg-slate-800 p-6 rounded-2xl text-white overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" />

          {isRunning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-sm z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <Sparkles className="w-12 h-12 text-brand-300" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mt-4 font-mono text-sm text-brand-300 flex flex-col items-center gap-1"
              >
                <span className="animate-pulse">Collecting Data...</span>
                <span className="animate-pulse" style={{ animationDelay: '0.3s' }}>Validating...</span>
                <span className="animate-pulse" style={{ animationDelay: '0.6s' }}>Running ML Model...</span>
              </motion.div>
            </div>
          )}

          <h3 className="font-bold font-display text-lg mb-6 flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 text-brand-300" /> AI Prediction Result
          </h3>

          <div className="space-y-6 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                <p className="text-sm text-brand-200 mb-1">Predicted Grade</p>
                <p className="text-3xl font-bold">{showResult ? (simAtt > 75 && simInt > 70 ? 'B+' : 'C+') : 'C+'}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                <p className="text-sm text-brand-200 mb-1">Risk Level</p>
                <p className={cn("text-xl font-bold uppercase", showResult ? (simAtt > 75 && simInt > 70 ? 'text-emerald-400' : 'text-red-400') : 'text-red-400')}>
                  {showResult ? (simAtt > 75 && simInt > 70 ? 'LOW' : 'HIGH') : 'HIGH'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-brand-200 mb-2">Key Factors Influencing Prediction</p>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Attendance</span>
                    <span className="text-red-400">Critical Negative Impact</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} className="h-full bg-red-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Internal Marks</span>
                    <span className="text-amber-400">High Negative Impact</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} className="h-full bg-amber-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/faculty/students')} className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors border border-white/20 text-sm backdrop-blur-md">
              Trigger Intervention Plan
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function NavItem({ to, icon: Icon, label, collapsed }: { to: string; icon: any; label: string; collapsed: boolean }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
        isActive
          ? "bg-brand-600 text-white shadow-lg shadow-brand-500/25 font-semibold"
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
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

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const user = localStorage.getItem('eduxcel_user');
    if (user) setUserData(JSON.parse(user));
  }, []);

  const userName = userData?.name || 'Faculty';
  const userEmail = userData?.email || '';
  const initials = userName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();
  const sidebarW = collapsed ? 80 : 240;
  const sidebarPad = collapsed ? 10 : 16;

  const handleLogout = () => {
    localStorage.removeItem('eduxcel_token');
    localStorage.removeItem('eduxcel_user');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] dark:bg-dark-bg flex font-sans text-brand-900 dark:text-slate-100 overflow-hidden relative transition-colors duration-500">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-200/30 dark:bg-brand-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-orange/10 dark:bg-accent-orange/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Sidebar */}
      <aside
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        className={cn(
          "glass-panel dark:glass-panel border-r transition-all duration-300 flex flex-col z-20 fixed top-3 left-3 bottom-3 rounded-2xl overflow-hidden",
          collapsed ? "w-20 p-3" : "w-60 p-5"
        )}>
        <div className={cn("mb-8 flex", collapsed ? "justify-center" : "items-center")}>
          {!collapsed && <Logo size="md" showText={true} />}
          {collapsed && <Logo size="sm" showText={false} />}
          {!collapsed && <span className="ml-2 text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded-md mt-1">FACULTY</span>}
        </div>

        <div className="flex-1 space-y-1.5 overflow-y-auto pr-2 scrollbar-hide">
          <NavItem to="/faculty/dashboard" icon={LayoutDashboard} label="Overview" collapsed={collapsed} />
          <NavItem to="/faculty/schedule" icon={Calendar} label="Schedule" collapsed={collapsed} />
          <NavItem to="/faculty/assignments" icon={ClipboardList} label="Assignments" collapsed={collapsed} />
          <NavItem to="/faculty/students" icon={Users} label="All Students" collapsed={collapsed} />
          <NavItem to="/faculty/analytics" icon={FileBarChart} label="Class Analytics" collapsed={collapsed} />
          <NavItem to="/faculty/profile" icon={Settings} label="Profile" collapsed={collapsed} />
        </div>

        <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className={cn("flex items-center", collapsed ? "flex-col gap-2" : "gap-2 justify-between")}>
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10" style={{ marginLeft: sidebarW + sidebarPad, transition: 'margin-left 0.3s', padding: '12px 16px 12px 0' }}>
        {/* Header */}
        <header className="glass-panel dark:glass-panel h-16 flex items-center justify-between px-6 z-10 flex-shrink-0 rounded-2xl mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setCollapsed(!collapsed)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              {collapsed ? <Menu style={{ width: 18, height: 18 }} /> : <ChevronLeft style={{ width: 18, height: 18 }} />}
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{`${getGreeting()}, ${userName.split(' ')[0]} 👋`}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Monitor class performance and identify at-risk students.</p>
            </div>
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
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wide">FACULTY MODE</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pb-5">
          <div className="max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<FacultyOverview />} />
              <Route path="schedule" element={<FacultySchedule />} />
              <Route path="assignments" element={<FacultyAssignments />} />
              <Route path="students" element={<AllStudents />} />
              <Route path="analytics" element={<FacultyAnalytics />} />
              <Route path="profile" element={<FacultyProfile />} />
              <Route path="student/:id" element={<StudentDetail />} />
              <Route path="*" element={<FacultyOverview />} />
            </Routes>
          </div>

          <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400 w-full">
            © {new Date().getFullYear()} EduXcel AI. <span className="font-medium">Learn Today • Excel Tomorrow • Succeed Forever.</span>
          </footer>
        </div>
      </main>

      {/* Floating Action Button */}
      <ChatbotButton isAIOpen={isAIOpen} setIsAIOpen={setIsAIOpen} roleContext="faculty" />
    </div>
  );
}