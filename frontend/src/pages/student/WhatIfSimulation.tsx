import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, Zap } from 'lucide-react';
import api from '@/lib/api';

interface SimResult { predictedGrade: string; riskLevel: string; confidence: number; }

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const color = value >= 75 ? 'accent-emerald-500' : value >= 60 ? 'accent-amber-500' : 'accent-red-500';
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <label className="font-semibold text-slate-700 dark:text-slate-300">{label}</label>
        <span className={`font-black text-lg ${value >= 75 ? 'text-emerald-600 dark:text-emerald-400' : value >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>{value}%</span>
      </div>
      <div className="relative h-3 bg-slate-100 dark:bg-slate-700 rounded-full">
        <motion.div animate={{ width: `${value}%` }} className={`absolute h-full rounded-full ${value >= 75 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} />
        <input type="range" min={0} max={100} value={value} onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
      </div>
      <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
        <span>0%</span><span>50%</span><span>100%</span>
      </div>
    </div>
  );
}

const GRADE_ORDER = ['F', 'D', 'C', 'C+', 'B', 'B+', 'A', 'A+'];

export default function WhatIfSimulation() {
  const [attendance, setAttendance] = useState(68);
  const [marks, setMarks] = useState(54);
  const [assignments, setAssignments] = useState(65);
  const [result, setResult] = useState<SimResult | null>(null);
  const [loading, setLoading] = useState(false);

  const baseGrade = 'C+';

  const run = async () => {
    setLoading(true);
    try {
      const res = await api.predictions.whatIf({
        attendance, internalMarks: marks, previousSGPA: 7.8,
        assignmentCompletion: assignments,
        subjectPerformance: { DBMS: 58, 'Mathematics III': 45, OS: 78, Networks: 72 },
        semester: 6,
      });
      setResult(res.data);
    } catch {
      const score = (attendance * 0.3 + marks * 0.3 + assignments * 0.1) / 70;
      const grade = score >= 0.9 ? 'A+' : score >= 0.8 ? 'A' : score >= 0.7 ? 'B+' : score >= 0.6 ? 'B' : score >= 0.5 ? 'C+' : 'C';
      const risk = score >= 0.7 ? 'Low' : score >= 0.5 ? 'Medium' : 'High';
      setResult({ predictedGrade: grade, riskLevel: risk, confidence: Math.round(score * 95) });
    } finally {
      setLoading(false);
    }
  };

  const improved = result && GRADE_ORDER.indexOf(result.predictedGrade) > GRADE_ORDER.indexOf(baseGrade);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What If I Improve?</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Adjust your metrics to simulate how your predicted grade changes.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm space-y-8">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-2">
          <SlidersHorizontal className="w-5 h-5" />
          <span className="font-bold text-sm uppercase tracking-wider">Adjust Your Metrics</span>
        </div>
        <Slider label="Attendance" value={attendance} onChange={setAttendance} />
        <Slider label="Internal Marks" value={marks} onChange={setMarks} />
        <Slider label="Assignment Completion" value={assignments} onChange={setAssignments} />
        <button onClick={run} disabled={loading}
          className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 disabled:opacity-50">
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Zap className="w-5 h-5" /> Run Simulation</>}
        </button>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
            className="bg-gradient-to-br from-brand-50 dark:from-brand-500/10 to-indigo-50 dark:to-indigo-500/10 p-6 rounded-2xl border border-brand-200 dark:border-brand-500/30 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Simulation Result</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-white dark:bg-dark-surface rounded-xl border border-slate-100 dark:border-dark-border">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Was</p>
                <p className="text-3xl font-black text-slate-400 dark:text-slate-500">{baseGrade}</p>
              </div>
              <div className="flex items-center justify-center text-2xl font-black text-brand-400">→</div>
              <div className="text-center p-4 bg-brand-50 dark:bg-brand-500/20 rounded-xl border border-brand-200 dark:border-brand-500/30">
                <p className="text-xs font-bold text-brand-500 dark:text-brand-400 uppercase tracking-wider mb-1">Now</p>
                <p className="text-3xl font-black text-brand-600 dark:text-brand-400">{result.predictedGrade}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-dark-surface rounded-xl border border-slate-100 dark:border-dark-border">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Risk Level</p>
                <p className={`text-xl font-black uppercase ${result.riskLevel === 'Low' ? 'text-emerald-600 dark:text-emerald-400' : result.riskLevel === 'Medium' ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>{result.riskLevel}</p>
              </div>
              <div className="p-4 bg-white dark:bg-dark-surface rounded-xl border border-slate-100 dark:border-dark-border">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Confidence</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{result.confidence}%</p>
              </div>
            </div>
            {improved && (
              <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm font-semibold text-emerald-700 dark:text-emerald-400 text-center">
                Great improvement! Keep up this effort to secure {result.predictedGrade}.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
