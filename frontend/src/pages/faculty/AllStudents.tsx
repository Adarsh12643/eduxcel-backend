import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

export default function AllStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.faculty.getAllStudents();
        if (res.success && res.data) {
          setStudents(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Students</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and monitor all students in your department.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or roll number..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded-xl outline-none focus:border-brand-500 text-sm"
            />
          </div>
          <button className="px-4 py-2 bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded-xl flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-500">Loading students...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-dark-elevated rounded-t-xl">
                <tr>
                  <th className="p-4 rounded-tl-xl">Student</th>
                  <th className="p-4">Roll Number</th>
                  <th className="p-4">Attendance</th>
                  <th className="p-4">Performance</th>
                  <th className="p-4">Risk Level</th>
                  <th className="p-4 rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((student, i) => (
                  <motion.tr 
                    key={student.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold text-xs">
                          {student.name?.charAt(0) || 'U'}
                        </div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{student.name}</p>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-500">{student.rollNumber || 'N/A'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full", student.attendance < 75 ? "bg-red-500" : "bg-emerald-500")}
                            style={{ width: `${student.attendance || 0}%` }}
                          />
                        </div>
                        <span className={cn("text-xs font-semibold", student.attendance < 75 ? "text-red-500" : "text-slate-600 dark:text-slate-400")}>
                          {student.attendance || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      {student.performance || student.internalMarks || 0}%
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border",
                        student.academicRisk === 'High' || student.risk === 'High' ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800" :
                        student.academicRisk === 'Medium' || student.risk === 'Medium' ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800" :
                        "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800"
                      )}>
                        {student.academicRisk || student.risk || 'Low'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => navigate(`/faculty/student/${student.id || student._id}`)}
                        className="text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-semibold text-sm flex items-center gap-1"
                      >
                        Profile <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

