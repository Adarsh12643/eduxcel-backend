import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Bell, Shield, Brain, Save, RefreshCw } from 'lucide-react';

const settingsSections = [
  {
    id: 'general',
    title: 'General Settings',
    icon: Settings,
    color: 'text-brand-600 dark:text-brand-400',
    bg: 'bg-brand-50 dark:bg-brand-500/20',
    fields: [
      { label: 'Institution Name', type: 'text', value: 'EduXcel University' },
      { label: 'Academic Year', type: 'select', value: '2024-2025', options: ['2024-2025', '2025-2026'] },
      { label: 'Default Language', type: 'select', value: 'English', options: ['English', 'Hindi', 'Spanish'] },
    ],
  },
  {
    id: 'ai',
    title: 'AI Model Configuration',
    icon: Brain,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/30',
    fields: [
      { label: 'Prediction Model', type: 'select', value: 'EduXcel v3.0', options: ['EduXcel v2.0', 'EduXcel v3.0'] },
      { label: 'Confidence Threshold', type: 'text', value: '75%' },
      { label: 'Auto-Intervention', type: 'toggle', value: true },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    fields: [
      { label: 'Email Alerts', type: 'toggle', value: true },
      { label: 'Push Notifications', type: 'toggle', value: false },
      { label: 'Weekly Reports', type: 'toggle', value: true },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    icon: Shield,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    fields: [
      { label: 'Two-Factor Auth', type: 'toggle', value: true },
      { label: 'Session Timeout', type: 'select', value: '30 min', options: ['15 min', '30 min', '1 hour'] },
      { label: 'Password Policy', type: 'select', value: 'Strong', options: ['Standard', 'Strong', 'Custom'] },
    ],
  },
];

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure platform-wide preferences and AI behavior.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-brand-500/20 hover:scale-105 active:scale-95"
        >
          {saved ? <><RefreshCw className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>

      <div className="space-y-4">
        {settingsSections.map((section, i) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100 dark:border-dark-border flex items-center gap-3">
              <div className={`p-2 rounded-xl ${section.bg} ${section.color}`}>
                <section.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">{section.title}</h3>
            </div>
            <div className="p-5 space-y-5">
              {section.fields.map((field, j) => (
                <div key={j} className="flex items-center justify-between gap-4">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 min-w-[200px]">{field.label}</label>
                  {field.type === 'text' && (
                    <input
                      type="text"
                      defaultValue={field.value as string}
                      className="flex-1 max-w-sm px-4 py-2 bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-900 dark:text-white"
                    />
                  )}
                  {field.type === 'select' && (
                    <select
                      defaultValue={field.value as string}
                      className="flex-1 max-w-sm px-4 py-2 bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-900 dark:text-white"
                    >
                      {(field.options || []).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                  {field.type === 'toggle' && (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={field.value as boolean} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 dark:peer-focus:ring-brand-500/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
