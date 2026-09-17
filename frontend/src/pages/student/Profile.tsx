import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, BookOpen, Calendar, Award, Edit3, Save, Camera, Target, Building, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Profile({ userData }: { userData: any }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stored, setStored] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const u = localStorage.getItem('eduxcel_user');
    if (u) {
      const parsed = JSON.parse(u);
      setStored(parsed);
      setFormData(parsed);
    } else if (userData) {
      setFormData(userData);
    }
  }, [userData]);

  const profile = editing ? formData : (userData || stored || {});
  const name = profile.name || 'Student';
  const email = profile.email || '';
  const initials = name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('eduxcel_user', JSON.stringify(formData));
      setStored(formData);
      setEditing(false);
      setLoading(false);
      toast.success('Profile updated successfully');
    }, 600);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 max-w-3xl">
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
            <div className="flex-1 mr-4">
              {editing ? (
                <div className="space-y-2">
                  <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="text-2xl font-black text-slate-900 dark:text-white bg-transparent border-b-2 border-brand-500 focus:outline-none w-full max-w-xs" placeholder="Full Name" />
                  <div className="flex gap-2">
                    <input type="text" name="stream" value={formData.stream || ''} onChange={handleChange} className="text-brand-600 dark:text-brand-400 font-semibold text-sm bg-transparent border-b border-brand-300 dark:border-brand-700 focus:outline-none w-20" placeholder="Stream" />
                    <input type="text" name="course" value={formData.course || ''} onChange={handleChange} className="text-brand-600 dark:text-brand-400 font-semibold text-sm bg-transparent border-b border-brand-300 dark:border-brand-700 focus:outline-none w-32" placeholder="Course" />
                    <input type="number" name="semester" value={formData.semester || ''} onChange={handleChange} className="text-brand-600 dark:text-brand-400 font-semibold text-sm bg-transparent border-b border-brand-300 dark:border-brand-700 focus:outline-none w-16" placeholder="Sem" />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">{name}</h2>
                  <p className="text-brand-600 dark:text-brand-400 font-semibold text-sm mt-0.5">{profile.stream || 'B.Tech'} {profile.course || 'Computer Science'} • Semester {profile.semester || 1}</p>
                </>
              )}
            </div>
            {editing ? (
              <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-transparent bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save</>}
              </button>
            ) : (
              <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-dark-border text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-elevated transition-colors">
                <Edit3 className="w-4 h-4" /> Edit
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: Mail, label: 'Email', name: 'email', value: profile.email || '' },
          { icon: BookOpen, label: 'Roll Number', name: 'rollNumber', value: profile.rollNumber || 'Not Set' },
          { icon: Building, label: 'College', name: 'college', value: profile.college || 'Institute' },
          { icon: User, label: 'Section', name: 'section', value: profile.section || 'N/A' },
          { icon: Target, label: 'Target SGPA', name: 'targetSGPA', value: profile.targetSGPA || '8.5' },
          { icon: Award, label: 'Study Hours (hrs/day)', name: 'studyHours', value: profile.studyHours || '3' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white dark:bg-dark-surface p-4 rounded-xl border border-slate-100 dark:border-dark-border shadow-sm flex items-center gap-4">
            <div className="p-2.5 bg-brand-50 dark:bg-brand-500/20 rounded-xl text-brand-600 dark:text-brand-400 flex-shrink-0">
              <item.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{item.label}</p>
              {editing ? (
                <input type={item.name === 'studyHours' || item.name === 'targetSGPA' ? 'number' : 'text'} name={item.name} value={formData[item.name] || ''} onChange={handleChange} className="font-semibold text-slate-900 dark:text-white mt-0.5 bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded px-2 py-1 w-full text-sm outline-none focus:border-brand-500" />
              ) : (
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5 truncate">{item.value}{item.name === 'targetSGPA' && !editing ? ' / 10' : ''}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-brand-500" /> Gamification & Badges
        </h3>
        
        <div className="flex items-center gap-6 mb-6 p-4 bg-slate-50 dark:bg-dark-elevated rounded-xl border border-slate-100 dark:border-dark-border">
          <div className="flex-1">
            <div className="flex justify-between items-end mb-2">
              <p className="font-bold text-slate-900 dark:text-white">Level {profile.level || 1}</p>
              <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">{profile.xp || 0} XP</p>
            </div>
            <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full" 
                style={{ width: `${Math.min(((profile.xp || 0) % 1000) / 10, 100)}%` }} 
              />
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Earned Badges</p>
          <div className="flex flex-wrap gap-3">
            {profile.badges?.length > 0 ? profile.badges.map((b: string, i: number) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg text-yellow-700 dark:text-yellow-500 font-bold text-sm">
                🏆 {b}
              </div>
            )) : (
              <p className="text-sm text-slate-400">Keep learning to earn your first badge!</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
