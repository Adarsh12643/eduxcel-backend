import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie, Sector, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Award, AlertTriangle, BrainCircuit } from 'lucide-react';

const riskDistribution = [
  { name: 'Low Risk', value: 182, color: '#10b981' },
  { name: 'Medium Risk', value: 41, color: '#f59e0b' },
  { name: 'High Risk', value: 17, color: '#ef4444' },
];

const attendanceData = [
  { week: 'Week 1', attendance: 88 },
  { week: 'Week 2', attendance: 85 },
  { week: 'Week 3', attendance: 82 },
  { week: 'Week 4', attendance: 78 },
  { week: 'Week 5', attendance: 80 },
  { week: 'Week 6', attendance: 83 },
];

const gradeData = [
  { grade: 'A+', count: 12 },
  { grade: 'A', count: 28 },
  { grade: 'B+', count: 45 },
  { grade: 'B', count: 52 },
  { grade: 'C+', count: 31 },
  { grade: 'C', count: 18 },
  { grade: 'D', count: 8 },
  { grade: 'F', count: 3 },
];

const gradeColors: Record<string, string> = {
  'A+': '#10b981', 'A': '#3567fb', 'B+': '#00A3E0', 'B': '#f59e0b',
  'C+': '#f97316', 'C': '#ef4444', 'D': '#dc2626', 'F': '#991b1b',
};

export default function FacultyAnalytics() {
  const totalStudents = 240;
  const avgAttendance = Math.round(attendanceData.reduce((s, w) => s + w.attendance, 0) / attendanceData.length);
  const passRate = Math.round(((totalStudents - gradeData[gradeData.length - 1].count) / totalStudents) * 100);
  const atRisk = riskDistribution.find(r => r.name === 'High Risk')?.value || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Class Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Comprehensive performance insights for your cohort.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wide">LIVE DATA</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: totalStudents.toString(), icon: Users, color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-50 dark:bg-brand-500/20' },
          { label: 'Avg Attendance', value: `${avgAttendance}%`, icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
          { label: 'Pass Rate', value: `${passRate}%`, icon: Award, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30' },
          { label: 'At Risk', value: atRisk.toString(), icon: AlertTriangle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30' },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-dark-surface p-5 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">+{Math.floor(Math.random() * 10 + 1)}%</span>
            </div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{kpi.label}</p>
            <p className={`text-3xl font-black mt-1 ${kpi.color}`}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Attendance Trend</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0047BA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0047BA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[60, 100]} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                <Area type="monotone" dataKey="attendance" stroke="#0047BA" strokeWidth={3} fill="url(#attGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Risk Distribution</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {riskDistribution.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Grade Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Grade Distribution</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gradeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={32}>
                {gradeData.map((entry) => (
                  <Cell key={entry.grade} fill={gradeColors[entry.grade]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
