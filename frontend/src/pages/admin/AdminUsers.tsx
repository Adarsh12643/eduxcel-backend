import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, MoreHorizontal, UserPlus, Shield, UserCheck, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';

const users = [
  { id: 1, name: 'Arjun Kumar', email: 'arjun@eduxcel.com', role: 'Student', department: 'CSE', status: 'Active', lastActive: '2 min ago', avatar: 'AK' },
  { id: 2, name: 'Sarah Williams', email: 'sarah@eduxcel.com', role: 'Student', department: 'CSE', status: 'Active', lastActive: '1 hour ago', avatar: 'SW' },
  { id: 3, name: 'Prof. Smith', email: 'smith@eduxcel.com', role: 'Faculty', department: 'CSE', status: 'Active', lastActive: '5 min ago', avatar: 'PS' },
  { id: 4, name: 'System Admin', email: 'admin@eduxcel.com', role: 'Admin', department: 'IT', status: 'Active', lastActive: 'Online', avatar: 'SA' },
  { id: 5, name: 'Michael Chen', email: 'michael@eduxcel.com', role: 'Student', department: 'CSE', status: 'Inactive', lastActive: '3 days ago', avatar: 'MC' },
  { id: 6, name: 'Emma Davis', email: 'emma@eduxcel.com', role: 'Student', department: 'ECE', status: 'Active', lastActive: '30 min ago', avatar: 'ED' },
];

const roleConfig: Record<string, { bg: string; text: string; border: string; icon: any }> = {
  Admin: { bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', border: 'border-red-100 dark:border-red-800', icon: Shield },
  Faculty: { bg: 'bg-brand-50 dark:bg-brand-500/20', text: 'text-brand-600 dark:text-brand-300', border: 'border-brand-100 dark:border-brand-700', icon: UserCheck },
  Student: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-800', icon: UserPlus },
};

const statusConfig: Record<string, { bg: string; text: string }> = {
  Active: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
  Inactive: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-500 dark:text-slate-400' },
};

export default function AdminUsers() {
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage platform users, roles, and permissions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-brand-500/20 hover:scale-105 active:scale-95">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-dark-elevated/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-4 pl-6">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Department</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Active</th>
                <th className="p-4 pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((user, i) => {
                const rCfg = roleConfig[user.role];
                const sCfg = statusConfig[user.status];
                const RoleIcon = rCfg.icon;
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-bold text-sm border-2 border-white dark:border-slate-600 shadow-sm">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">{user.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border', rCfg.bg, rCfg.text, rCfg.border)}>
                        <RoleIcon className="w-3 h-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-700 dark:text-slate-300">{user.department}</td>
                    <td className="p-4">
                      <span className={cn('px-2.5 py-1 rounded-full text-xs font-bold', sCfg.bg, sCfg.text)}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400">{user.lastActive}</td>
                    <td className="p-4 pr-6">
                      <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
