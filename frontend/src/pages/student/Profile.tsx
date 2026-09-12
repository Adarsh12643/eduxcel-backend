import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, BookOpen, Calendar, Award, Edit3, Save, Camera } from 'lucide-react';

export default function Profile({ userData }: { userData: any }) {
  const [editing, setEditing] = useState(false);
  const [stored, setStored] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem('eduxcel_user');
    if (u) setStored(JSON.parse(u));
  }, []);

  const name = userData?.name || stored?.name || 'Student';
  const email = userData?.email || stored?.email || '';
  const initials = name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Student Profile</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Your academic identity and personal information.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 dark:from-brand-700 dark:via-brand-600 dark:to-indigo-700 relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        </div>
        <div className="px-6 pb-6 pt-14 relative">
          <div className="absolute -top-10 left-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 border-4 border-white dark:border-dark-surface shadow-lg flex items-center justify-center text-white text-2xl font-black">
              {initials || 'S'}
            </div>
          </div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{name}</h2>
              <p className="text-brand-600 dark:text-brand-400 font-semibold text-sm mt-0.5">B.Tech Computer Science • Semester 6</p>
            </div>
            <button onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-dark-border text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-elevated transition-colors">
              {editing ? <><Save className="w-4 h-4" /> Save</> : <><Edit3 className="w-4 h-4" /> Edit</>}
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: Mail, label: 'Email', value: email },
          { icon: BookOpen, label: 'Roll Number', value: userData?.rollNumber || stored?.rollNumber || 'CS-2024-102' },
          { icon: User, label: 'Department', value: userData?.department || stored?.department || 'Computer Science' },
          { icon: Calendar, label: 'Batch', value: userData?.batch || stored?.batch || '2021–2025' },
          { icon: Award, label: 'Current SGPA', value: '8.1 / 10' },
          { icon: Award, label: 'Predicted Grade', value: 'B+' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white dark:bg-dark-surface p-4 rounded-xl border border-slate-100 dark:border-dark-border shadow-sm flex items-center gap-4">
            <div className="p-2.5 bg-brand-50 dark:bg-brand-500/20 rounded-xl text-brand-600 dark:text-brand-400 flex-shrink-0">
              <item.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{item.label}</p>
              <p className="font-semibold text-slate-900 dark:text-white mt-0.5 truncate">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
