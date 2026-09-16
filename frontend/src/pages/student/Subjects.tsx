import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { BookOpen, TrendingUp, AlertTriangle, CheckCircle2, Edit2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

const colorMap: Record<string, { badge: string; bar: string; icon: string }> = {
  red: { badge: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800', bar: 'bg-red-500', icon: 'text-red-500' },
  amber: { badge: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800', bar: 'bg-amber-500', icon: 'text-amber-500' },
  emerald: { badge: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800', bar: 'bg-emerald-500', icon: 'text-emerald-500' },
  brand: { badge: 'bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 border-brand-100 dark:border-brand-700', bar: 'bg-brand-500', icon: 'text-brand-500' },
};

function getColorForRisk(risk: string) {
  if (risk === 'High') return 'red';
  if (risk === 'Medium') return 'amber';
  if (risk === 'Low') return 'emerald';
  return 'brand';
}

function getStatusForRisk(risk: string) {
  if (risk === 'High') return 'Critical';
  if (risk === 'Medium') return 'Needs Focus';
  if (risk === 'Low') return 'Excellent';
  return 'Good';
}

export default function Subjects() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ score: 0, attendance: 0 });

  const fetchSubjects = async () => {
    try {
      const res = await api.student.getSubjects();
      if (res.success && res.data) {
        setSubjects(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleEdit = (subItem: any) => {
    setEditingId(subItem.id);
    setEditForm({ score: subItem.currentScore || 0, attendance: subItem.attendance || 80 });
  };

  const handleSave = async (id: string) => {
    try {
      setLoading(true);
      await api.student.updateSubject(id, { currentScore: editForm.score, attendance: editForm.attendance });
      await fetchSubjects();
    } catch (e) {
      console.error(e);
    } finally {
      setEditingId(null);
      setLoading(false);
    }
  };

  if (loading && subjects.length === 0) return <div className="p-10 text-center animate-pulse">Loading subjects...</div>;

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-700 dark:to-indigo-700 text-white relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-1">My Subjects</h2>
          <p className="text-brand-100 text-sm max-w-xl">Subject-wise performance, attendance and AI risk assessment. Update your metrics to tune your recovery plan.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {subjects.map((subItem, i) => {
          const isEditing = editingId === subItem.id;
          const sub = {
            id: subItem.id,
            name: subItem.subject?.name || 'Unknown',
            code: subItem.subject?.code || '---',
            credits: subItem.subject?.credits || 0,
            attendance: subItem.attendance || 0,
            score: subItem.currentScore || 0,
            predicted: subItem.predictedScore || 0,
            risk: subItem.riskLevel || 'Low'
          };
          
          const colorKey = getColorForRisk(sub.risk);
          const c = colorMap[colorKey];
          const status = getStatusForRisk(sub.risk);
          const RiskIcon = sub.risk === 'High' ? AlertTriangle : sub.risk === 'Low' ? CheckCircle2 : TrendingUp;
          
          return (
            <motion.div key={sub.id || i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${c.badge} border`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{sub.name}</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{sub.code} ? {sub.credits} Credits</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={cn('px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border', c.badge)}>
                      {status}
                    </span>
                    {!isEditing ? (
                      <button onClick={() => handleEdit(subItem)} className="text-xs text-slate-400 hover:text-brand-500 flex items-center gap-1">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-1">
                        <button onClick={() => handleSave(sub.id)} className="p-1 text-emerald-500 hover:bg-emerald-50 rounded">
                          <Save className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-slate-400 hover:bg-slate-50 rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-1">Score</p>
                    {isEditing ? (
                      <input 
                        type="number" 
                        value={editForm.score} 
                        onChange={e => setEditForm({ ...editForm, score: Number(e.target.value) })}
                        className="w-full text-xl font-black bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded px-2 py-1"
                      />
                    ) : (
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{sub.score}<span className="text-sm text-slate-400">%</span></p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mb-1">Attendance</p>
                    {isEditing ? (
                      <input 
                        type="number" 
                        value={editForm.attendance} 
                        onChange={e => setEditForm({ ...editForm, attendance: Number(e.target.value) })}
                        className="w-full text-xl font-black bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded px-2 py-1"
                      />
                    ) : (
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{sub.attendance}<span className="text-sm text-slate-400">%</span></p>
                    )}
                  </div>
                </div>
                {!isEditing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Current Score</span>
                      <span className="font-semibold">Predicted: {sub.predicted}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${sub.score}%` }} transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                        className={`h-full rounded-full ${c.bar}`} />
                    </div>
                  </div>
                )}
              </div>
              <div className={cn('px-5 py-3 border-t border-slate-100 dark:border-dark-border flex items-center justify-between', sub.risk === 'High' ? 'bg-red-50/50 dark:bg-red-900/10' : 'bg-slate-50/50 dark:bg-dark-elevated/30')}>
                <div className="flex items-center gap-2">
                  <RiskIcon className={`w-4 h-4 ${c.icon}`} />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Risk: <span className={c.icon.replace('text-', 'text-')}>{sub.risk}</span></span>
                </div>
                {sub.risk !== 'Low' && (
                  <button onClick={() => navigate('/student/recovery')} className={cn('text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border cursor-pointer hover:opacity-80', c.badge)}>
                    Start Recovery
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
        {subjects.length === 0 && !loading && <p className="text-slate-500 p-4">No subjects found.</p>}
      </div>
    </div>
  );
}
