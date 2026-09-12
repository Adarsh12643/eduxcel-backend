import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Sparkles, Database, Award } from 'lucide-react';

const enrollmentData = [
  { month: 'Jan', students: 3200, faculty: 280 },
  { month: 'Feb', students: 3400, faculty: 290 },
  { month: 'Mar', students: 3600, faculty: 295 },
  { month: 'Apr', students: 3800, faculty: 300 },
  { month: 'May', students: 4100, faculty: 305 },
  { month: 'Jun', students: 4521, faculty: 312 },
];

const deptPerformance = [
  { dept: 'CSE', score: 85, risk: 12 },
  { dept: 'ECE', score: 78, risk: 18 },
  { dept: 'MECH', score: 72, risk: 22 },
  { dept: 'CIVIL', score: 68, risk: 28 },
  { dept: 'IT', score: 80, risk: 15 },
];

const aiUsage = [
  { day: 'Mon', queries: 1240 },
  { day: 'Tue', queries: 1380 },
  { day: 'Wed', queries: 1520 },
  { day: 'Thu', queries: 1100 },
  { day: 'Fri', queries: 980 },
  { day: 'Sat', queries: 650 },
  { day: 'Sun', queries: 420 },
];

const deptColors = ['#0047BA', '#3567fb', '#00A3E0', '#FF8C00', '#7C3AED'];

export default function AdminAnalytics() {
  const totalStudents = 4521;
  const totalFaculty = 312;
  const aiQueries = 12400;
  const systemHealth = 99.9;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Global Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Institution-wide performance and system metrics.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wide">REAL-TIME</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: totalStudents.toLocaleString(), icon: Users, color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-50 dark:bg-brand-500/20', trend: '+12%' },
          { label: 'Active Faculty', value: totalFaculty.toString(), icon: Award, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', trend: '+2%' },
          { label: 'AI Queries Today', value: `${(aiQueries / 1000).toFixed(1)}k`, icon: Sparkles, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30', trend: '+45%' },
          { label: 'System Health', value: `${systemHealth}%`, icon: Database, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/30', trend: 'Optimal' },
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
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">{kpi.trend}</span>
            </div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{kpi.label}</p>
            <p className={`text-3xl font-black mt-1 ${kpi.color}`}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Enrollment Growth</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentData}>
                <defs>
                  <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0047BA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0047BA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                <Area type="monotone" dataKey="students" stroke="#0047BA" strokeWidth={3} fill="url(#enrollGrad)" name="Students" />
                <Area type="monotone" dataKey="faculty" stroke="#00A3E0" strokeWidth={2} fill="none" strokeDasharray="5 5" name="Faculty" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">AI Platform Usage</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aiUsage}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="queries" radius={[6, 6, 0, 0]} barSize={28}>
                  {aiUsage.map((entry, index) => (
                    <Cell key={index} fill={index % 2 === 0 ? '#0047BA' : '#3567fb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Department Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Department Performance</h3>
        <div className="space-y-4">
          {deptPerformance.map((dept, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className="flex items-center gap-4"
            >
              <span className="w-20 text-sm font-bold text-slate-700 dark:text-slate-300">{dept.dept}</span>
              <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dept.score}%` }}
                  transition={{ duration: 1.2, delay: 0.8 + i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ background: deptColors[i] }}
                />
              </div>
              <span className="w-12 text-right text-sm font-black text-slate-900 dark:text-white">{dept.score}%</span>
              <span className="w-16 text-right text-xs font-bold text-red-500 dark:text-red-400">{dept.risk}% risk</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
