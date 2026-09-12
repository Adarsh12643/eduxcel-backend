import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const schedule: Record<string, { time: string; subject: string; room: string; type: string; color: string }[]> = {
  Monday: [
    { time: '9:00 AM', subject: 'DBMS', room: 'Lab 3', type: 'Lab', color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800' },
    { time: '11:00 AM', subject: 'Mathematics III', room: 'Room 201', type: 'Lecture', color: 'bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 border-brand-100 dark:border-brand-700' },
  ],
  Tuesday: [
    { time: '10:00 AM', subject: 'Operating Systems', room: 'Room 105', type: 'Lecture', color: 'bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 border-brand-100 dark:border-brand-700' },
  ],
  Wednesday: [
    { time: '9:00 AM', subject: 'Computer Networks', room: 'Room 202', type: 'Lecture', color: 'bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 border-brand-100 dark:border-brand-700' },
    { time: '2:00 PM', subject: 'DBMS', room: 'Room 201', type: 'Lecture', color: 'bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 border-brand-100 dark:border-brand-700' },
  ],
  Thursday: [
    { time: '11:00 AM', subject: 'Mathematics III', room: 'Room 201', type: 'Lecture', color: 'bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 border-brand-100 dark:border-brand-700' },
  ],
  Friday: [
    { time: '9:00 AM', subject: 'Operating Systems', room: 'Lab 2', type: 'Lab', color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800' },
    { time: '1:00 PM', subject: 'Computer Networks', room: 'Room 105', type: 'Lecture', color: 'bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 border-brand-100 dark:border-brand-700' },
  ],
};

const dayColors = ['#0047BA', '#3567fb', '#00A3E0', '#7C3AED', '#FF8C00'];

export default function FacultySchedule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Teaching Schedule</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Your weekly timetable for Semester 6.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded-full shadow-sm">
          <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wide">AUG 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map((day, i) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden hover:shadow-md transition-all group"
          >
            <div
              className="px-4 py-3 border-b border-slate-100 dark:border-dark-border flex items-center justify-between"
              style={{ background: `linear-gradient(135deg, ${dayColors[i]}10, ${dayColors[i]}05)` }}
            >
              <p className="font-bold text-sm text-slate-900 dark:text-white">{day}</p>
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: dayColors[i] }}
              />
            </div>
            <div className="p-3 space-y-2">
              {(schedule[day] || []).map((cls, j) => (
                <motion.div
                  key={j}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 + j * 0.05 }}
                  className={cn('p-3 rounded-xl border text-xs transition-all hover:shadow-sm cursor-pointer', cls.color)}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Clock className="w-3 h-3 opacity-70" />
                    <span className="font-semibold opacity-80">{cls.time}</span>
                  </div>
                  <p className="font-bold text-sm mb-1">{cls.subject}</p>
                  <div className="flex items-center gap-1.5 opacity-70">
                    <MapPin className="w-3 h-3" />
                    <span>{cls.room}</span>
                  </div>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-white/60 dark:bg-black/20 font-semibold text-[10px] uppercase tracking-wider">
                    {cls.type}
                  </span>
                </motion.div>
              ))}
              {!(schedule[day] || []).length && (
                <div className="text-center py-8">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-2">
                    <Calendar className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">No classes</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-brand-500/10 dark:to-indigo-500/10 rounded-2xl border border-brand-100 dark:border-brand-500/30 p-5 flex items-center gap-4"
      >
        <div className="p-3 bg-brand-100 dark:bg-brand-500/20 rounded-xl text-brand-600 dark:text-brand-400">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-brand-900 dark:text-brand-100">Total Teaching Hours</p>
          <p className="text-2xl font-black text-brand-600 dark:text-brand-400">12 hrs <span className="text-sm font-semibold text-brand-500 dark:text-brand-300">this week</span></p>
        </div>
      </motion.div>
    </div>
  );
}
