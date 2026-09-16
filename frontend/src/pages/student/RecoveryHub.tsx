import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Sparkles, BookOpen, Clock, CheckCircle2, Circle, PlayCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

export default function RecoveryHub() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<any | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await api.student.getRecoveryPlan();
        if (res.success && res.data) {
          // Normalize active status on load (ensure only one is active at a time)
          let foundActive = false;
          const normalizedTasks = (res.data.recommendations || []).map((t: any) => {
            if (t.status === 'done') return t;
            if (!foundActive) {
              foundActive = true;
              return { ...t, status: 'active' };
            }
            return { ...t, status: 'pending' };
          });
          setTasks(normalizedTasks);
          setResources(res.data.videoRecommendations || []);
        }
      } catch (err) {
        console.error('Failed to fetch recommendations', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const markNextStepComplete = () => {
    setTasks(prev => {
      const newTasks = [...prev];
      const activeIdx = newTasks.findIndex(t => t.status === 'active' || t.status === 'in_progress');
      if (activeIdx !== -1) {
        const completedTask = newTasks[activeIdx];
        newTasks[activeIdx].status = 'done';
        
        // Trigger chatbot if they completed specific steps (like Improve Class Attendance or the final step)
        if (completedTask.step?.includes('Improve Class Attendance') || completedTask.title?.includes('Improve Class Attendance') || activeIdx === newTasks.length - 1) {
           localStorage.setItem('pending_xcello_msg', "You've completed your learning path! Feel free to ask your doubts, or we can move towards a small quiz for your learning test.");
           window.dispatchEvent(new Event('open-xcello'));
        }

        if (activeIdx + 1 < newTasks.length) {
          newTasks[activeIdx + 1].status = 'active';
        }
      }
      return newTasks;
    });
  };

  const done = tasks.filter(t => t.status === 'done').length;
  const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

  const getIframeSrc = (channel: any) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://eduxcel-frontend.web.app';
    if (channel.isSearch || channel.channelId === 'SEARCH_QUERY') {
      const query = channel.searchQuery || channel.title.replace(' (Content-Based AI Recommendation)', '');
      return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}&origin=${origin}`;
    }
    if (channel.link?.includes('watch?v=')) {
      return `https://www.youtube.com/embed/${new URLSearchParams(channel.link.split('?')[1]).get('v')}?autoplay=1&origin=${origin}`;
    }
    return `https://www.youtube.com/embed/videoseries?list=UU${channel.channelId?.substring(2)}&autoplay=1&origin=${origin}`;
  };

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
          {tasks.map((task, i) => {
            const isActive = task.status === 'active' || task.status === 'in_progress';
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className={cn('p-4 rounded-2xl border transition-all flex gap-3',
                  isActive ? 'bg-white dark:bg-dark-surface border-brand-200 dark:border-brand-500/30 shadow-md ring-2 ring-brand-500/20' :
                  task.status === 'done' ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/50' :
                  'bg-slate-50/50 dark:bg-dark-elevated/50 border-slate-200 dark:border-dark-border opacity-70')}>
                <div className="mt-0.5 flex-shrink-0">
                  {task.status === 'done' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                   isActive ? <div className="w-5 h-5 rounded-full border-2 border-brand-500 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" /></div> :
                   <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />}
                </div>
                <div className="flex-1">
                  <h4 className={cn('font-semibold text-sm', isActive ? 'text-brand-900 dark:text-brand-100' : task.status === 'done' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300')}>{task.step || task.title}</h4>
                  <p className={cn("text-xs mt-0.5", task.status === 'done' ? 'text-emerald-600/80 dark:text-emerald-500/80 line-through' : 'text-slate-500 dark:text-slate-400')}>{task.desc}</p>
                  
                  {isActive && (
                    <button 
                      onClick={markNextStepComplete}
                      className="mt-3 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/20 dark:hover:bg-brand-500/30 text-brand-600 dark:text-brand-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      Mark Step Complete <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Personalized Learning Hub</h3>
            <span className="text-xs font-medium px-2.5 py-1 bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Recommended Content
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-2 text-center text-slate-500 py-10 animate-pulse">Loading highly targeted recommendations...</div>
            ) : resources.length > 0 ? resources.map((res, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                onClick={() => setSelectedChannel(res)}
                className={cn("relative bg-white dark:bg-dark-surface rounded-2xl border dark:border-dark-border overflow-hidden hover:shadow-xl transition-all group cursor-pointer flex flex-col", { "border-brand-500 ring-2 ring-brand-500/50": res.isTopPick })}>
                {res.isTopPick && (
                  <div className="absolute top-2 right-2 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm">
                    Top Pick
                  </div>
                )}
                <div className="h-40 w-full bg-slate-900 relative overflow-hidden flex items-center justify-center">
                   <img src={res.thumbnail} alt={res.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                   <div className="absolute z-10 flex flex-col items-center justify-center">
                     <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-lg" />
                     <span className="text-white text-xs font-bold mt-2 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">START LEARNING</span>
                   </div>
                </div>
                <div className="p-4 flex-1 flex flex-col bg-white dark:bg-dark-surface z-20">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors text-sm line-clamp-2 flex-1">{res.title}</h4>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] text-slate-500 font-medium">{res.channel || 'Curated Videos'}</span>
                    <button className="text-[10px] font-bold text-white bg-brand-600 px-3 py-1 rounded-md group-hover:bg-brand-700 transition-colors shadow-sm">Play</button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-2 text-center text-slate-500 py-10">No recommendations available at this time.</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Ultra-Immersive Video Modal */}
      {selectedChannel && (
        <div className="fixed top-0 bottom-0 right-0 left-0 md:left-[270px] bg-slate-100/90 dark:bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6 lg:p-16 animate-in fade-in-0 duration-300">
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.4, type: 'spring' }} className="w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border">
            
            {/* Header INSIDE the modal card */}
            <div className="p-4 bg-slate-50 dark:bg-dark-elevated border-b border-slate-200 dark:border-dark-border flex justify-between items-start flex-shrink-0">
              <div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white line-clamp-1">{selectedChannel.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  AI Recommended Content for your Weak Subjects
                </p>
              </div>
              <button onClick={() => setSelectedChannel(null)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 w-full bg-black relative">
              <iframe
                className="w-full h-full absolute inset-0"
                src={getIframeSrc(selectedChannel)}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-dark-elevated border-t border-slate-200 dark:border-dark-border flex-shrink-0 flex items-center justify-end">
                  <button 
                    onClick={() => {
                      markNextStepComplete();
                      setSelectedChannel(null);
                    }}
                    className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-[0_0_15px_rgba(5,150,105,0.2)] flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Mark as Complete
                  </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}