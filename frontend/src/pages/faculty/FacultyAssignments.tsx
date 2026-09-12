import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, ClipboardList, Clock, Users, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const assignments = [
  { id: 1, title: 'DBMS ER Diagram', subject: 'DBMS', class: 'CS6A', due: '2 days', submissions: 28, total: 45, priority: 'High', status: 'active' },
  { id: 2, title: 'OS Process Scheduling Report', subject: 'Operating Systems', class: 'CS6B', due: '5 days', submissions: 42, total: 45, priority: 'Medium', status: 'active' },
  { id: 3, title: 'Math III Problem Set 4', subject: 'Mathematics III', class: 'CS6A', due: '1 day', submissions: 45, total: 45, priority: 'High', status: 'pending_review' },
  { id: 4, title: 'Networks Lab Report', subject: 'Computer Networks', class: 'CS6B', due: '7 days', submissions: 38, total: 45, priority: 'Low', status: 'graded' },
  { id: 5, title: 'DBMS SQL Joins Quiz', subject: 'DBMS', class: 'CS6A', due: '3 days', submissions: 30, total: 45, priority: 'Medium', status: 'active' },
];

const priorityConfig: Record<string, { bg: string; text: string; border: string }> = {
  High: { bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', border: 'border-red-100 dark:border-red-800' },
  Medium: { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-800' },
  Low: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-800' },
};

const statusConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  active: { bg: 'bg-brand-50 dark:bg-brand-500/20', text: 'text-brand-600 dark:text-brand-300', border: 'border-brand-100 dark:border-brand-700', label: 'Active' },
  pending_review: { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-800', label: 'Pending Review' },
  graded: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-800', label: 'Graded' },
};

export default function FacultyAssignments() {
  const [search, setSearch] = useState('');

  const filtered = assignments.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Assignments & Grading</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track submissions and manage grading workflow.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-brand-500/20 hover:scale-105 active:scale-95">
          <Plus className="w-4 h-4" />
          New Assignment
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map((a, i) => {
          const pCfg = priorityConfig[a.priority];
          const sCfg = statusConfig[a.status];
          const progress = Math.round((a.submissions / a.total) * 100);
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white dark:bg-dark-surface p-5 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-brand-50 dark:bg-brand-500/20 rounded-xl text-brand-600 dark:text-brand-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{a.title}</h4>
                      <span className={cn('px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border', pCfg.bg, pCfg.text, pCfg.border)}>
                        {a.priority}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-brand-600 dark:text-brand-400">{a.subject}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span>{a.class}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due in {a.due}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                          className="h-full bg-brand-500 rounded-full"
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 w-16 text-right">{a.submissions}/{a.total}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={cn('px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full border', sCfg.bg, sCfg.text, sCfg.border)}>
                    {sCfg.label}
                  </span>
                  <button className="p-2 rounded-xl text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/20 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
