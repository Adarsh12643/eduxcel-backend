import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, Building2, Phone, Edit3, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminProfile() {
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
    }
  }, []);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('eduxcel_user', JSON.stringify(formData));
      setStored(formData);
      setEditing(false);
      setLoading(false);
      toast.success('Admin profile updated successfully');
    }, 600);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const profile = editing ? formData : (stored || {});
  const name = profile.name || 'System Admin';
  const email = profile.email || 'admin@eduxcel.com';
  const initials = name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden"
      >
        <div className="h-32 bg-gradient-to-r from-slate-800 via-brand-800 to-indigo-900 dark:from-slate-900 dark:via-brand-900 dark:to-indigo-950 relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        </div>
        <div className="px-6 pb-6 pt-14 relative">
          <div className="absolute -top-10 left-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 border-4 border-white dark:border-dark-surface shadow-lg flex items-center justify-center text-white text-2xl font-black">
              {initials || 'A'}
            </div>
          </div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 mr-4">
              {editing ? (
                <div className="space-y-2">
                  <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="text-2xl font-black text-slate-900 dark:text-white bg-transparent border-b-2 border-brand-500 focus:outline-none w-full max-w-xs" placeholder="Full Name" />
                  <div>
                    <input type="text" name="role" value={formData.role || ''} onChange={handleChange} className="text-brand-600 dark:text-brand-400 font-semibold text-sm bg-transparent border-b border-brand-300 dark:border-brand-700 focus:outline-none w-full max-w-xs" placeholder="Role / Title" />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">{name}</h2>
                  <p className="text-brand-600 dark:text-brand-400 font-semibold text-sm mt-0.5">{profile.role || 'Super Administrator'}</p>
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
          { icon: Mail, label: 'Email', name: 'email', value: profile.email || 'admin@eduxcel.com' },
          { icon: Shield, label: 'Access Level', name: 'accessLevel', value: profile.accessLevel || 'Level 1 (Full)' },
          { icon: Building2, label: 'Institution', name: 'institution', value: profile.institution || 'EduXcel University' },
          { icon: Phone, label: 'Emergency Contact', name: 'phone', value: profile.phone || '+1 (555) 000-0000' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white dark:bg-dark-surface p-4 rounded-xl border border-slate-100 dark:border-dark-border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 flex-shrink-0">
              <item.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{item.label}</p>
              {editing ? (
                <input type="text" name={item.name} value={formData[item.name] || ''} onChange={handleChange} className="font-semibold text-slate-900 dark:text-white mt-0.5 bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded px-2 py-1 w-full text-sm outline-none focus:border-brand-500" />
              ) : (
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5 truncate">{item.value}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
