import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, BookOpen, Target, Rocket, ChevronRight, ChevronLeft, GraduationCap, Building, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../lib/api';
import { cn } from '../lib/utils';

const getSubjects = (course: string, semester: number): string[] => {
  if (course === 'CSE' || course === 'IT') {
    if (semester <= 2) return ['Engineering Mathematics', 'Physics', 'Programming in C', 'Electrical Engineering'];
    if (semester <= 4) return ['Data Structures', 'Algorithms', 'Database Systems', 'Computer Networks', 'Operating Systems'];
    return ['Web Development', 'Machine Learning', 'Cloud Computing', 'Cyber Security', 'Software Engineering'];
  }
  if (course === 'ECE' || course === 'EEE') {
    return ['Circuit Theory', 'Signals & Systems', 'Digital Electronics', 'Control Systems', 'Microprocessors'];
  }
  return ['Mathematics', 'Physics', 'Chemistry', 'Communication Skills'];
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [stream, setStream] = useState('B.Tech');
  const [course, setCourse] = useState('CSE');
  const [college, setCollege] = useState('');
  const [semester, setSemester] = useState<number>(1);
  const [section, setSection] = useState('');
  const [rollNumber, setRollNumber] = useState('');

  const [targetSGPA, setTargetSGPA] = useState<number>(8.5);
  const [studyHours, setStudyHours] = useState(3);
  const [learningStyle, setLearningStyle] = useState('visual');

  const [previousScores, setPreviousScores] = useState<Record<string, { sessional1: number, sessional2: number, classTest: number, total: number }>>({});
  const [weakSubjects, setWeakSubjects] = useState<string[]>([]);
  const [department, setDepartment] = useState('');
  const [subjectsTaught, setSubjectsTaught] = useState<string[]>([]);

  useEffect(() => {
    const u = localStorage.getItem('eduxcel_user');
    if (u) {
      setUser(JSON.parse(u));
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  const currentSubjects = useMemo(() => getSubjects(course, semester), [course, semester]);

  useEffect(() => {
    if (step === 4) {
      const autoWeak: string[] = [];
      Object.keys(previousScores).forEach(sub => {
        if (previousScores[sub]?.total < 60) {
          autoWeak.push(sub);
        }
      });
      setWeakSubjects(prev => Array.from(new Set([...prev, ...autoWeak])));
    }
  }, [step, previousScores]);

  const handleScoreChange = (subject: string, field: 'sessional1' | 'sessional2' | 'classTest', value: string) => {
    const maxVal = field === 'classTest' ? 20 : 40;
    const numValue = Math.min(Math.max(parseInt(value) || 0, 0), maxVal);
    
    setPreviousScores(prev => {
      const current = prev[subject] || { sessional1: 0, sessional2: 0, classTest: 0, total: 0 };
      const updated = { ...current, [field]: numValue };
      updated.total = (updated.sessional1 || 0) + (updated.sessional2 || 0) + (updated.classTest || 0);
      return { ...prev, [subject]: updated };
    });
  };

  const toggleWeakSubject = (sub: string) => {
    setWeakSubjects(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]);
  };

  const toggleTaughtSubject = (sub: string) => {
    setSubjectsTaught(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]);
  };

  const handleComplete = async () => {
    setLoading(true);
    setError('');
    
    try {
      const payload: any = {
        studyHours,
        learningStyle,
        department,
        targetSGPA: Number(targetSGPA),
        semester: Number(semester),
        section,
        rollNumber,
      };

      if (user?.role === 'student') {
        payload.stream = stream;
        payload.course = course;
        payload.college = college;
        payload.weakSubjects = weakSubjects;
        payload.previousScores = previousScores;
      }

      if (user?.role === 'faculty') {
        payload.subjectsTaught = subjectsTaught;
      }

      const res = await api.auth.onboard(payload);

      if (res.success && res.data) {
        const updatedUser = { ...user, ...res.data };
        delete updatedUser.isOnboarded;
        updatedUser.isOnboarded = true;
        localStorage.setItem('eduxcel_user', JSON.stringify(updatedUser));
        navigate(`/${user?.role}/dashboard`);
      }
    } catch (err: any) {
      console.error('Onboarding failed:', err);
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] flex items-center justify-center">Loading...</div>;

  const isStudent = user.role === 'student';

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const slideVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-500/10 dark:bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-3xl relative z-10">
        <div className="bg-white/80 dark:bg-[#161b22]/80 backdrop-blur-xl rounded-3xl p-8 border border-white dark:border-[#30363d] shadow-xl relative overflow-hidden">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-400">EduXcel</span>, {user.name?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Let's set up your profile to personalize your experience.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100 dark:border-red-800">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {isStudent && (
            <div className="mb-8 relative">
              <div className="h-2 w-full bg-slate-100 dark:bg-[#0d1117] rounded-full overflow-hidden border border-slate-200 dark:border-[#30363d]">
                <motion.div 
                  className="h-full bg-gradient-to-r from-brand-600 to-brand-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span className={step >= 1 ? 'text-brand-500' : ''}>Profile</span>
                <span className={step >= 2 ? 'text-brand-500' : ''}>Goals</span>
                <span className={step >= 3 ? 'text-brand-500' : ''}>Scores</span>
                <span className={step >= 4 ? 'text-brand-500' : ''}>Preferences</span>
              </div>
            </div>
          )}

          <div className="min-h-[400px]">
            {isStudent ? (
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" variants={slideVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.2 }} className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white"><GraduationCap className="w-5 h-5 text-brand-500"/> Academic Profile</h2>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold mb-2 dark:text-slate-300">Stream</label>
                        <select value={stream} onChange={e => setStream(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl px-4 py-3 outline-none focus:border-brand-500 dark:text-white">
                          <option>B.Tech</option>
                          <option>M.Tech</option>
                          <option>BCA</option>
                          <option>MCA</option>
                          <option>BSc</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 dark:text-slate-300">Course / Branch</label>
                        <select value={course} onChange={e => setCourse(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl px-4 py-3 outline-none focus:border-brand-500 dark:text-white">
                          <option>CSE</option>
                          <option>IT</option>
                          <option>ECE</option>
                          <option>EEE</option>
                          <option>ME</option>
                          <option>Civil</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold mb-2 dark:text-slate-300">College Name</label>
                        <input type="text" value={college} onChange={e => setCollege(e.target.value)} placeholder="e.g. Institute of Technology" className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl px-4 py-3 outline-none focus:border-brand-500 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 dark:text-slate-300">Semester</label>
                        <select value={semester} onChange={e => setSemester(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl px-4 py-3 outline-none focus:border-brand-500 dark:text-white">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 dark:text-slate-300">Section</label>
                        <input type="text" value={section} onChange={e => setSection(e.target.value)} placeholder="e.g. A" className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl px-4 py-3 outline-none focus:border-brand-500 dark:text-white" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold mb-2 dark:text-slate-300">Roll Number</label>
                        <input type="text" value={rollNumber} onChange={e => setRollNumber(e.target.value)} placeholder="e.g. 21CS001" className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl px-4 py-3 outline-none focus:border-brand-500 dark:text-white" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" variants={slideVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.2 }} className="space-y-8">
                    <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white"><Target className="w-5 h-5 text-brand-500"/> Target Setting</h2>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2 dark:text-slate-300">Target SGPA</label>
                        <div className="relative">
                          <input type="number" min="0" max="10" step="0.1" value={targetSGPA} onChange={e => setTargetSGPA(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl px-4 py-4 text-xl font-bold outline-none focus:border-brand-500 dark:text-white" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">/ 10</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 dark:text-slate-300">Daily Study Hours</label>
                        <div className="relative">
                          <input type="number" min="0" max="24" value={studyHours} onChange={e => setStudyHours(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl px-4 py-4 text-xl font-bold outline-none focus:border-brand-500 dark:text-white" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">hrs</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-3 dark:text-slate-300">Preferred Learning Style</label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { id: 'visual', label: 'Visual (Videos)', icon: Sparkles },
                          { id: 'auditory', label: 'Auditory (Lectures)', icon: Brain },
                          { id: 'reading', label: 'Reading (Notes)', icon: BookOpen }
                        ].map(style => (
                          <button
                            key={style.id}
                            onClick={() => setLearningStyle(style.id)}
                            className={cn(
                              'p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all',
                              learningStyle === style.id
                                ? 'bg-brand-50 dark:bg-brand-500/10 border-brand-500 text-brand-700 dark:text-brand-300 shadow-md shadow-brand-500/10'
                                : 'bg-slate-50 dark:bg-[#0d1117] border-slate-200 dark:border-[#30363d] text-slate-500 hover:border-slate-300'
                            )}
                          >
                            <style.icon className={cn("w-6 h-6", learningStyle === style.id ? "text-brand-600 dark:text-brand-400" : "text-slate-400")} />
                            <span className="text-sm font-semibold">{style.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" variants={slideVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.2 }} className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white"><FileText className="w-5 h-5 text-brand-500"/> Subject-wise Previous Scores</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Enter your internal marks for {course} Semester {semester}. This helps our ML engine predict your performance.</p>
                    
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                      {currentSubjects.map(sub => {
                        const score = previousScores[sub] || { sessional1: '', sessional2: '', classTest: '', total: 0 };
                        return (
                          <div key={sub} className="bg-slate-50 dark:bg-[#0d1117] p-4 rounded-2xl border border-slate-200 dark:border-[#30363d]">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">{sub}</h3>
                            <div className="grid grid-cols-4 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sessional 1 (40)</label>
                                <input type="number" min="0" max="40" value={score.sessional1} onChange={e => handleScoreChange(sub, 'sessional1', e.target.value)} className="w-full bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-brand-500 dark:text-white" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sessional 2 (40)</label>
                                <input type="number" min="0" max="40" value={score.sessional2} onChange={e => handleScoreChange(sub, 'sessional2', e.target.value)} className="w-full bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-brand-500 dark:text-white" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Class Test (20)</label>
                                <input type="number" min="0" max="20" value={score.classTest} onChange={e => handleScoreChange(sub, 'classTest', e.target.value)} className="w-full bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-brand-500 dark:text-white" />
                              </div>
                              <div className="flex flex-col justify-end">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Total</label>
                                <div className={cn(
                                  "w-full rounded-lg px-3 py-2 text-sm font-bold flex items-center justify-center border",
                                  score.total < 60 ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                )}>
                                  {score.total} / 100
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="step4" variants={slideVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.2 }} className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white"><AlertCircle className="w-5 h-5 text-brand-500"/> Weak Areas & Preferences</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Select the subjects you find most difficult. We've pre-selected subjects where your internal marks are below 60%.</p>
                    
                    <div className="flex flex-wrap gap-3">
                      {currentSubjects.map(sub => {
                        const isWeak = weakSubjects.includes(sub);
                        return (
                          <button
                            key={sub}
                            onClick={() => toggleWeakSubject(sub)}
                            className={cn(
                              'px-5 py-3 rounded-xl text-sm font-bold transition-all border flex items-center gap-2',
                              isWeak
                                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 border-brand-600'
                                : 'bg-slate-50 dark:bg-[#0d1117] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#30363d] hover:border-brand-400'
                            )}
                          >
                            {isWeak && <CheckCircle className="w-4 h-4" />}
                            {sub}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white"><Building className="w-5 h-5 text-brand-500"/> Faculty Profile</h2>
                
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold mb-2 dark:text-slate-300">Department</label>
                    <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl px-4 py-3 outline-none focus:border-brand-500 dark:text-white">
                      <option value="">Select department</option>
                      <option>Computer Science</option>
                      <option>Information Technology</option>
                      <option>Electronics</option>
                      <option>Mathematics</option>
                      <option>Physics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-slate-300">Employee ID</label>
                    <input type="text" value={rollNumber} onChange={e => setRollNumber(e.target.value)} placeholder="e.g. EMP1023" className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-xl px-4 py-3 outline-none focus:border-brand-500 dark:text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 dark:text-slate-300">Subjects You Teach</label>
                  <div className="flex flex-wrap gap-2">
                    {getSubjects('CSE', 4).map((sub) => (
                      <button
                        key={sub}
                        onClick={() => toggleTaughtSubject(sub)}
                        className={cn(
                          'px-4 py-2 rounded-xl text-sm font-medium transition-all border',
                          subjectsTaught.includes(sub)
                            ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20 border-brand-600'
                            : 'bg-slate-50 dark:bg-[#0d1117] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#30363d] hover:border-brand-400'
                        )}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-[#30363d] flex justify-between">
            {isStudent && step > 1 ? (
              <button
                onClick={prevStep}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-[#30363d] transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
            ) : (
              <div /> 
            )}

            {isStudent && step < totalSteps ? (
              <button
                onClick={nextStep}
                className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                Next Step <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-brand-500/25 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Complete & Launch'} <Rocket className="w-5 h-5" />
              </button>
            )}
          </div>

        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #475569;
        }
      `}</style>
    </div>
  );
}
