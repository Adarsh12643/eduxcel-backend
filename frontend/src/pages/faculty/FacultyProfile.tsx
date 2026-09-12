import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, BookOpen, Calendar, Award, Edit3, Save, Building2, Phone } from 'lucide-react';

export default function FacultyProfile() {
  const [editing, setEditing] = useState(false);
  const [stored, setStored] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem('eduxcel_user');
    if (u) setStored(JSON.parse(u));
  }, []);

  const name = stored?.name || 'Prof. Smith';
  const email = stored?.email || 'prof.smith@eduxcel.com';
  const initials = name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Faculty Profile</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Your professional information and teaching details.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden"
      >
        <div className="h-32 bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 dark:from-brand-700 dark:via-brand-600 dark:to-indigo-700 relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        </div>
        <div className="px-6 pb-6 pt-14 relative">
          <div className="absolute -top-10 left-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 border-4 border-white dark:border-dark-surface shadow-lg flex items-center justify-center text-white text-2xl font-black">
              {initials}
            </div>
          </div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{name}</h2>
              <p className="text-brand-600 dark:text-brand-400 font-semibold text-sm mt-0.5">Computer Science Department</p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-dark-border text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-elevated transition-colors"
            >
              {editing ? <><Save className="w-4 h-4" /> Save</> : <><Edit3 className="w-4 h-4" /> Edit</>}
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: Mail, label: 'Email', value: email },
          { icon: BookOpen, label: 'Department', value: 'Computer Science' },
          { icon: Building2, label: 'Employee ID', value: 'FAC-2024-001' },
          { icon: Calendar, label: 'Experience', value: '8 Years' },
          { icon: Award, label: 'Qualification', value: 'Ph.D. Computer Science' },
          { icon: Phone, label: 'Office', value: 'Room 301, Block B' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white dark:bg-dark-surface p-4 rounded-xl border border-slate-100 dark:border-dark-border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
          >
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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-brand-500/10 dark:to-indigo-500/10 rounded-2xl border border-brand-100 dark:border-brand-500/30 p-6"
      >
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Teaching Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Classes', value: '5' },
            { label: 'Students', value: '240' },
            { label: 'Avg Rating', value: '4.8' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-4 bg-white dark:bg-dark-surface rounded-xl border border-slate-100 dark:border-dark-border">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-brand-600 dark:text-brand-400">{stat.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
