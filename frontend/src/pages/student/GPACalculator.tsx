import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2 } from 'lucide-react';

const GRADES: Record<string, number> = { 'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0 };

interface Subject { id: number; name: string; credits: number; currentGrade: string; targetGrade: string; }

const defaultSubjects: Subject[] = [
  { id: 1, name: 'DBMS', credits: 4, currentGrade: 'C', targetGrade: 'B+' },
  { id: 2, name: 'Math III', credits: 4, currentGrade: 'D', targetGrade: 'B' },
  { id: 3, name: 'Operating Systems', credits: 3, currentGrade: 'B', targetGrade: 'A' },
  { id: 4, name: 'Computer Networks', credits: 3, currentGrade: 'B+', targetGrade: 'A' },
];

function calcSGPA(subjects: Subject[], field: 'currentGrade' | 'targetGrade') {
  const total = subjects.reduce((s, sub) => s + sub.credits, 0);
  const pts = subjects.reduce((s, sub) => s + (GRADES[sub[field]] ?? 0) * sub.credits, 0);
  return total ? (pts / total).toFixed(2) : '0.00';
}

export default function GPACalculator() {
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects);
  const [nextId, setNextId] = useState(5);

  const update = (id: number, field: keyof Subject, value: string | number) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addSubject = () => {
    setSubjects(prev => [...prev, { id: nextId, name: 'New Subject', credits: 3, currentGrade: 'B', targetGrade: 'A' }]);
    setNextId(n => n + 1);
  };

  const remove = (id: number) => setSubjects(prev => prev.filter(s => s.id !== id));

  const current = calcSGPA(subjects, 'currentGrade');
  const target = calcSGPA(subjects, 'targetGrade');
  const diff = (parseFloat(target) - parseFloat(current)).toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Academic Goal Calculator</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Use the "What If?" mode to simulate grade improvements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-slate-50 dark:bg-dark-elevated border border-slate-100 dark:border-dark-border flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Current SGPA</p>
          <p className="text-5xl font-black text-slate-900 dark:text-white">{current}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Based on current grades</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/30 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold text-brand-500 dark:text-brand-400 uppercase tracking-wider mb-2">Target SGPA</p>
          <p className="text-5xl font-black text-brand-600 dark:text-brand-400">{target}</p>
          <p className="text-xs text-brand-400 dark:text-brand-500 mt-1">If you achieve target grades</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center ${parseFloat(diff) >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'}`}>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Improvement</p>
          <p className={`text-5xl font-black ${parseFloat(diff) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{parseFloat(diff) >= 0 ? '+' : ''}{diff}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">SGPA points gain</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-dark-border flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white">Subject Grades</h3>
          <button onClick={addSubject} className="flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-dark-elevated text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 text-left">Subject</th>
                <th className="px-5 py-3 text-left">Credits</th>
                <th className="px-5 py-3 text-left">Current Grade</th>
                <th className="px-5 py-3 text-left">Target Grade (What If?)</th>
                <th className="px-5 py-3 text-left">Points</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {subjects.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3">
                    <input value={sub.name} onChange={e => update(sub.id, 'name', e.target.value)}
                      className="bg-transparent font-semibold text-slate-900 dark:text-white outline-none border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-brand-500 transition-colors w-full" />
                  </td>
                  <td className="px-5 py-3">
                    <input type="number" min={1} max={6} value={sub.credits} onChange={e => update(sub.id, 'credits', parseInt(e.target.value) || 1)}
                      className="bg-transparent text-slate-600 dark:text-slate-400 outline-none w-12 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-brand-500 transition-colors" />
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{sub.currentGrade}</span>
                  </td>
                  <td className="px-5 py-3">
                    <select value={sub.targetGrade} onChange={e => update(sub.id, 'targetGrade', e.target.value)}
                      className="bg-brand-50 dark:bg-brand-500/20 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-300 text-sm rounded-lg px-2 py-1 outline-none font-semibold focus:ring-2 focus:ring-brand-500/30">
                      {Object.keys(GRADES).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3 font-mono font-bold text-brand-600 dark:text-brand-400">
                    {((GRADES[sub.targetGrade] ?? 0) * sub.credits).toFixed(0)} pts
                  </td>
                  <td className="px-3 py-3">
                    <button onClick={() => remove(sub.id)} className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
