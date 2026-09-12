import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, Sparkles, Building, BarChart3, Database, Moon, Sun, X, Menu, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from '@/components/shared/Logo';
import { cn } from '@/lib/utils';
import AdminUsers from './admin/AdminUsers';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminSettings from './admin/AdminSettings';
import XceloChatbot from '@/components/shared/XceloChatbot';
import { useTheme } from '@/context/ThemeContext';

function AdminOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Students', value: '4,521', trend: '+12%', icon: Users, color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-50 dark:bg-brand-500/20' },
          { title: 'Active Faculty', value: '312', trend: '+2%', icon: Building, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
          { title: 'AI Queries Today', value: '12.4k', trend: '+45%', icon: Sparkles, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30' },
          { title: 'System Health', value: '99.9%', trend: 'Optimal', icon: Database, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/30' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-emerald-500 text-sm font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">{stat.trend}</span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold">{stat.title}</h3>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-brand-500/10 dark:to-indigo-500/10 rounded-2xl border border-brand-100 dark:border-brand-500/30 p-8 text-center"
      >
        <Database className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">More Admin Modules Coming Soon</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">This dashboard is configured to overview institution-wide analytics and manage global settings.</p>
      </motion.div>
    </div>
  );
}

function NavItem({ to, icon: Icon, label, collapsed }: { to: string; icon: any; label: string; collapsed: boolean }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
        isActive
          ? "bg-brand-600 text-white shadow-lg shadow-brand-500/25 font-semibold"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400 font-medium"
      )}
    >
      <Icon className="flex-shrink-0 transition-transform group-hover:scale-110" style={{ width: 18, height: 18 }} />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const user = localStorage.getItem('eduxcel_user');
    if (user) setUserData(JSON.parse(user));
  }, []);

  const userName = userData?.name || 'System Admin';
  const userEmail = userData?.email || '';
  const initials = userName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();
  const sidebarW = collapsed ? 80 : 240;
  const sidebarPad = collapsed ? 10 : 16;

  const handleLogout = () => {
    localStorage.removeItem('eduxcel_token');
    localStorage.removeItem('eduxcel_user');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] dark:bg-dark-bg flex font-sans text-brand-900 dark:text-slate-100 overflow-hidden relative transition-colors duration-500">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-200/30 dark:bg-brand-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-teal/10 dark:bg-accent-teal/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Sidebar */}
      <aside
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        className={cn(
          "glass-panel dark:glass-panel border-r transition-all duration-300 flex flex-col z-20 fixed top-3 left-3 bottom-3 rounded-2xl overflow-hidden",
          collapsed ? "w-20 p-3" : "w-60 p-5"
        )}>
        <div className={cn("mb-8 flex", collapsed ? "justify-center" : "items-center")}>
          {!collapsed && <Logo size="md" showText={true} />}
          {collapsed && <Logo size="sm" showText={false} />}
          {!collapsed && <span className="ml-2 text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 rounded-md mt-1">ADMIN</span>}
        </div>

        <div className="flex-1 space-y-1.5 overflow-y-auto pr-2 scrollbar-hide">
          <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Overview" collapsed={collapsed} />
          <NavItem to="/admin/users" icon={Users} label="User Management" collapsed={collapsed} />
          <NavItem to="/admin/analytics" icon={BarChart3} label="Global Analytics" collapsed={collapsed} />
          <NavItem to="/admin/settings" icon={Settings} label="System Settings" collapsed={collapsed} />
        </div>

        <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className={cn("flex items-center", collapsed ? "flex-col gap-2" : "gap-2 justify-between")}>
            <div className={cn("flex items-center gap-3 min-w-0", collapsed && "justify-center")}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center font-bold text-xs border-2 border-white dark:border-slate-600 shadow-sm flex-shrink-0">
                {initials}
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-brand-900 dark:text-white tracking-tight truncate">{userName}</p>
                  <p className="text-[10px] text-brand-500 dark:text-brand-400 font-mono tracking-tighter uppercase truncate">{userEmail}</p>
                </div>
              )}
            </div>
            <div className={cn("flex items-center gap-1", collapsed ? "flex-col" : "flex-row")}>
              {!collapsed && (
                <button onClick={toggleTheme} className="text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/20" title="Toggle theme">
                  {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                </button>
              )}
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Logout">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10" style={{ marginLeft: sidebarW + sidebarPad, transition: 'margin-left 0.3s', padding: '12px 16px 12px 0' }}>
        {/* Header */}
        <header className="glass-panel dark:glass-panel h-16 flex items-center justify-between px-6 z-10 flex-shrink-0 rounded-2xl mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setCollapsed(!collapsed)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              {collapsed ? <Menu style={{ width: 18, height: 18 }} /> : <ChevronLeft style={{ width: 18, height: 18 }} />}
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{`${getGreeting()}, ${userName.split(' ')[0]} 👋`}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Platform-wide statistics and system health.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-elevated border border-slate-200 dark:border-dark-border rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wide">SYSTEM ONLINE</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pb-5">
          <div className="max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </div>
          <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400 w-full">
            © {new Date().getFullYear()} EduXcel AI. <span className="font-medium">Learn Today • Excel Tomorrow • Succeed Forever.</span>
          </footer>
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsAIOpen(!isAIOpen)}
        className={cn(
          "fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 z-50 group",
          isAIOpen ? "bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white" : "bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white shadow-brand-500/30 hover:scale-105 active:scale-95"
        )}
      >
        {isAIOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6 group-hover:animate-pulse" />}
        {!isAIOpen && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white dark:border-dark-bg rounded-full"></span>
        )}
      </button>

      <XceloChatbot isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} roleContext="admin" />
    </div>
  );
}
