import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, BookOpen, Clock, CheckCircle2, Circle, PlayCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

const tasks = [
  { title: 'Improve Attendance', desc: 'Attend next 5 DBMS classes', status: 'done' },
  { title: 'Complete DBMS Module 3', desc: 'Normalization Practice', status: 'active' },
  { title: 'Watch Recommended Lecture', desc: 'Math III — Laplace Transforms', status: 'pending' },
  { title: 'Complete Practice Quiz', desc: 'DBMS Normal Forms Quiz', status: 'pending' },
  { title: 'Ask AI Assistant', desc: 'Clarify doubts on 3NF', status: 'pending' },
];

export default function RecoveryHub() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<any | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await api.student.getRecoveryPlan();
        console.log('Recovery plan response:', res);
        if (res.success && res.data) {
          // If the recovery plan returns videoRecommendations, set them
          setResources(res.data.videoRecommendations || res.data);
        }
      } catch (err) {
        console.error('Failed to fetch recommendations', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const done = tasks.filter(t => t.status === 'done').length;
  const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

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
              <Sparkles className="w-3 h-3" /> AI Picked YouTube Channels
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-2 text-center text-slate-500 py-10 animate-pulse">Loading AI video recommendations...</div>
            ) : resources.length > 0 ? resources.map((res, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                onClick={() => setSelectedChannel(res)}
                className={cn("bg-white dark:bg-dark-surface rounded-2xl border dark:border-dark-border overflow-hidden hover:shadow-lg transition-all group cursor-pointer flex flex-col", { "border-brand-500 ring-2 ring-brand-500/50": res.isTopPick })}>
                {res.isTopPick && (
                  <div className="absolute top-2 right-2 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                    Top Pick
                  </div>
                )}
                <div className="h-32 w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                   <img src={res.thumbnail} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors text-sm line-clamp-2 flex-1">{res.title}</h4>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] text-slate-500 font-medium">{res.videoCount} videos</span>
                    <button className="text-[10px] font-bold text-brand-600 bg-brand-50 dark:bg-brand-500/20 px-2 py-1 rounded-md hover:bg-brand-100 dark:hover:bg-brand-500/30 transition-colors">Explore</button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-2 text-center text-slate-500 py-10">No recommendations available at this time.</div>
            )}
          </div>
        </div>
      </div>
      {selectedChannel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} className="bg-white dark:bg-dark-surface rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b dark:border-dark-border flex justify-between items-center flex-shrink-0">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{selectedChannel.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Playing videos from this channel</p>
              </div>
              <button onClick={() => setSelectedChannel(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/videoseries?list=UU${selectedChannel.channelId.substring(2)}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4 border-t dark:border-dark-border flex-shrink-0">
                <button 
                  onClick={() => {
                    // Logic to mark as complete will go here
                    setSelectedChannel(null);
                  }}
                  className="px-4 py-2 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Mark as Watched & Close
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}