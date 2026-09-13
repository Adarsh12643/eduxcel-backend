import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, BookOpen, Clock, Target, Rocket, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import api from '../lib/api';
import { cn } from '../lib/utils';

export default function Onboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const u = localStorage.getItem('eduxcel_user');
    if (u) {
      setUser(JSON.parse(u));
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  const [studyHours, setStudyHours] = useState('');
  const [weakSubjects, setWeakSubjects] = useState<string[]>([]);
  const [learningStyle, setLearningStyle] = useState('');
  const [semester, setSemester] = useState('');
  const [targetSGPA, setTargetSGPA] = useState('');

  const [department, setDepartment] = useState('');
  const [subjectsTaught, setSubjectsTaught] = useState<string[]>([]);

  const subjects = ['Mathematics', 'Physics', 'DBMS', 'Operating Systems', 'Computer Networks', 'Data Structures', 'Algorithms', 'Discrete Math'];

  const toggleSubject = (sub: string, stateSetter: React.Dispatch<React.SetStateAction<string[]>>, current: string[]) => {
    if (current.includes(sub)) {
      stateSetter(current.filter((s) => s !== sub));
    } else {
      stateSetter([...current, sub]);
    }
  };

  const validate = (): boolean => {
    if (user?.role === 'student') {
      if (!studyHours || Number(studyHours) < 0) {
        setError('Please specify your daily self-study hours.');
        return false;
      }
      if (weakSubjects.length === 0) {
        setError('Please select at least one subject you find difficult.');
        return false;
      }
      if (!learningStyle) {
        setError('Please select your preferred learning style.');
        return false;
      }
    } else if (user?.role === 'faculty') {
      if (!department) {
        setError('Please select your department.');
        return false;
      }
      if (subjectsTaught.length === 0) {
        setError('Please select at least one subject you teach.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleComplete = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      setError('');

      const payload = user?.role === 'student'
        ? {
            studyHours: parseInt(studyHours),
            weakSubjects,
            learningStyle,
            semester: semester ? parseInt(semester) : undefined,
            targetSGPA: targetSGPA ? parseFloat(targetSGPA) : undefined,
            isOnboarded: true,
          }
        : {
            department,
            subjectsTaught,
            isOnboarded: true,
          };

      const res = await api.auth.onboard(payload);

      if (res.success) {
        const updatedUser = { ...user, isOnboarded: true, ...payload };
        delete updatedUser.isOnboarded;
        updatedUser.isOnboarded = true;
        localStorage.setItem('eduxcel_user', JSON.stringify(updatedUser));
        window.location.href = `/${user?.role}/dashboard`;
      }
    } catch (err: any) {
      console.error('Onboarding failed:', err);
      setError(err.message || 'Onboarding failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center p-6 font-sans">
      <div className="max-w-3xl w-full bg-white dark:bg-dark-surface rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-dark-border">
        <div className="bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-700 dark:to-indigo-700 p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 backdrop-blur-sm shadow-xl"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-black font-display mb-2">Welcome to EduXcel, {user.name.split(' ')[0]}!</h1>
          <p className="text-brand-100 max-w-md mx-auto">Let's set up your {user.role} profile so our AI can personalize your dashboard experience.</p>
        </div>

        <div className="p-10 space-y-8">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {user.role === 'student' ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-500" /> Daily Self-Study Hours
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={studyHours}
                    onChange={(e) => setStudyHours(e.target.value)}
                    placeholder="e.g. 3"
                    className="w-24 bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded-xl px-4 py-2.5 text-2xl font-bold text-center text-slate-900 dark:text-white outline-none focus:border-brand-500"
                  />
                  <span className="text-sm text-slate-500 dark:text-slate-400">/ day</span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">How many hours do you dedicate to self-study each day?</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-brand-500" /> Subjects You Find Difficult
                </label>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => toggleSubject(sub, setWeakSubjects, weakSubjects)}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium transition-all border',
                        weakSubjects.includes(sub)
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 border-brand-600'
                          : 'bg-slate-100 dark:bg-dark-elevated text-slate-600 dark:text-slate-300 border-slate-200 dark:border-dark-border hover:bg-slate-200 dark:hover:bg-dark-border'
                      )}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-brand-500" /> Preferred Learning Style
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setLearningStyle('visual')}
                    className={cn(
                      'p-3 rounded-xl border text-sm font-medium transition-all',
                      learningStyle === 'visual'
                        ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-500 text-brand-700 dark:text-brand-300'
                        : 'bg-white dark:bg-dark-surface border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    )}
                  >
                    Visual (Videos)
                  </button>
                  <button
                    onClick={() => setLearningStyle('auditory')}
                    className={cn(
                      'p-3 rounded-xl border text-sm font-medium transition-all',
                      learningStyle === 'auditory'
                        ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-500 text-brand-700 dark:text-brand-300'
                        : 'bg-white dark:bg-dark-surface border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    )}
                  >
                    Auditory (Lectures)
                  </button>
                  <button
                    onClick={() => setLearningStyle('reading')}
                    className={cn(
                      'p-3 rounded-xl border text-sm font-medium transition-all',
                      learningStyle === 'reading'
                        ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-500 text-brand-700 dark:text-brand-300'
                        : 'bg-white dark:bg-dark-surface border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    )}
                  >
                    Reading (Notes)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 text-slate-900 dark:text-white transition-all"
                  >
                    <option value="">Select semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Target SGPA</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={targetSGPA}
                    onChange={(e) => setTargetSGPA(e.target.value)}
                    placeholder="e.g. 8.5"
                    className="w-full bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded-xl px-4 py-2.5 outline-none focus:border-brand-500 text-slate-900 dark:text-white transition-all"
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded-xl px-4 py-3 outline-none focus:border-brand-500 text-slate-900 dark:text-white transition-all"
                >
                  <option value="">Select department</option>
                  <option>Computer Science</option>
                  <option>Information Technology</option>
                  <option>Electronics</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-500" /> Subjects You Teach
                </label>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => toggleSubject(sub, setSubjectsTaught, subjectsTaught)}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium transition-all border',
                        subjectsTaught.includes(sub)
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 border-brand-600'
                          : 'bg-slate-100 dark:bg-dark-elevated text-slate-600 dark:text-slate-300 border-slate-200 dark:border-dark-border hover:bg-slate-200'
                      )}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-dark-border">
            <button
              onClick={handleComplete}
              disabled={loading}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving Profile...' : 'Complete Setup & Go to Dashboard'} <Rocket className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
