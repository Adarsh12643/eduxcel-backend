import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, BookOpen, Clock, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const tasks = [
  { title: 'Improve Attendance', desc: 'Attend next 5 DBMS classes', status: 'done' },
  { title: 'Complete DBMS Module 3', desc: 'Normalization Practice', status: 'active' },
  { title: 'Watch Recommended Lecture', desc: 'Math III — Laplace Transforms', status: 'pending' },
  { title: 'Complete Practice Quiz', desc: 'DBMS Normal Forms Quiz', status: 'pending' },
  { title: 'Ask AI Assistant', desc: 'Clarify doubts on 3NF', status: 'pending' },
];

const resources = [
  { subject: 'DBMS', topic: '1NF, 2NF, 3NF Explained', duration: '15 min', type: 'Video', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400' },
  { subject: 'Mathematics III', topic: 'Laplace Transforms Practice', duration: '20 min', type: 'Quiz', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400' },
  { subject: 'DBMS', topic: 'SQL Joins Cheatsheet', duration: '5 min', type: 'Notes', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400' },
  { subject: 'Operating Systems', topic: 'Deadlock Avoidance', duration: '12 min', type: 'Video', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400' },
];

export default function RecoveryHub() {
  const done = tasks.filter(t => t.status === 'done').length;
  const pct = Math.round((done / tasks.length) * 100);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-700 dark:to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Recovery Mode Active
          </div>
          <h2 className="text-2xl font-black mb-1">You're not behind. You're being redirected.</h2>
          <p className="text-brand-100 text-sm max-w-xl">Our AI has identified areas needing attention. Follow this personalized recovery path to get back on track.</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden max-w-xs">
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} className="h-full bg-white rounded-full" />
            </div>
            <span className="text-sm font-bold">{pct}% Complete</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Your Recovery Plan</h3>
          {tasks.map((task, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className={cn('p-4 rounded-2xl border transition-all flex gap-3',
                task.status === 'active' ? 'bg-white dark:bg-dark-surface border-brand-200 dark:border-brand-500/30 shadow-md ring-1 ring-brand-500/20' :
                task.status === 'done' ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/50' :
                'bg-slate-50/50 dark:bg-dark-elevated/50 border-slate-200 dark:border-dark-border')}>
              <div className="mt-0.5 flex-shrink-0">
                {task.status === 'done' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                 task.status === 'active' ? <div className="w-5 h-5 rounded-full border-2 border-brand-500 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-brand-500" /></div> :
                 <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />}
              </div>
              <div>
                <h4 className={cn('font-semibold text-sm', task.status === 'active' ? 'text-brand-900 dark:text-brand-100' : task.status === 'done' ? 'text-emerald-700 dark:text-emerald-400 line-through' : 'text-slate-700 dark:text-slate-300')}>{task.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{task.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Personalized Learning Hub</h3>
            <span className="text-xs font-medium px-2.5 py-1 bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Recommended
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((res, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                <div className={cn('h-28 w-full flex items-center justify-center', res.color)}>
                  <BookOpen className="w-10 h-10 opacity-50" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{res.subject}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{res.duration}</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors text-sm">{res.topic}</h4>
                  <button className="w-full py-2 bg-slate-50 dark:bg-dark-elevated hover:bg-brand-50 dark:hover:bg-brand-500/20 text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-brand-300 font-medium rounded-xl text-xs transition-colors border border-slate-200 dark:border-dark-border hover:border-brand-200 dark:hover:border-brand-500/30">
                    Start {res.type}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
