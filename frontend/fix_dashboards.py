import re
import os

def fix_admin(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove the broken chatbot button and XceloChatbot at the bottom
    content = re.sub(r'\{/\* Floating Action Button \*/\}.*', '{/* Floating Action Button */}\n      <ChatbotButton isAIOpen={isAIOpen} setIsAIOpen={setIsAIOpen} roleContext="admin" />\n    </div>\n  );\n}', content, flags=re.DOTALL)
    
    # Add ChatbotButton import
    if 'ChatbotButton' not in content:
        content = content.replace("import XceloChatbot from '@/components/shared/XceloChatbot';", "import ChatbotButton from '@/components/shared/ChatbotButton';")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_faculty(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove the broken chatbot button
    content = re.sub(r'\{/\* Floating Action Button \*/\}.*', '{/* Floating Action Button */}\n      <ChatbotButton isAIOpen={isAIOpen} setIsAIOpen={setIsAIOpen} roleContext="faculty" />\n    </div>\n  );\n}', content, flags=re.DOTALL)
    
    # Add ChatbotButton import
    if 'ChatbotButton' not in content:
        content = content.replace("import XceloChatbot from '@/components/shared/XceloChatbot';", "import ChatbotButton from '@/components/shared/ChatbotButton';")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_student(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix duplicate classNames
    content = content.replace('className="card p-5 rounded-2xl flex flex-col relative overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">\n          className="card p-5 rounded-2xl flex flex-col relative overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-white dark:bg-dark-surface border border-slate-100 dark:border-dark-border">', 'className="card p-5 rounded-2xl flex flex-col relative overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-white dark:bg-dark-surface border border-slate-100 dark:border-dark-border">')
    
    # Fix duplicate KPI values
    content = content.replace('<div className="text-4xl font-mono-numbers font-black text-brand-900 dark:text-white tracking-tighter">84.2<span className="text-lg text-slate-400">%</span></div>\n            <div className="text-4xl font-mono-numbers font-black text-brand-900 dark:text-white tracking-tighter">{dashboardData?.overallPerformance || 0}<span className="text-lg text-slate-400">%</span></div>', '<div className="text-4xl font-mono-numbers font-black text-brand-900 dark:text-white tracking-tighter">{dashboardData?.overallPerformance || 0}<span className="text-lg text-slate-400">%</span></div>')
    
    content = content.replace('<div className="text-xs font-bold text-emerald-600 mb-1 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">\n              <TrendingUp className="w-3 h-3" /> +2.4%\n              <TrendingUp className="w-3 h-3" /> Live\n            </div>', '<div className="text-xs font-bold text-emerald-600 mb-1 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">\n              <TrendingUp className="w-3 h-3" /> Live\n            </div>')
    
    content = content.replace('<div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Projected SGPA</div>\n          <div className="text-4xl font-mono-numbers font-black text-brand-900 dark:text-white tracking-tighter mb-3">8.8<span className="text-lg text-slate-400">/10</span></div>\n          <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Current SGPA</div>\n          <div className="text-4xl font-mono-numbers font-black text-brand-900 dark:text-white tracking-tighter mb-3">{dashboardData?.currentSGPA || \'N/A\'}<span className="text-lg text-slate-400">/10</span></div>', '<div className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Current SGPA</div>\n          <div className="text-4xl font-mono-numbers font-black text-brand-900 dark:text-white tracking-tighter mb-3">{dashboardData?.currentSGPA || \'N/A\'}<span className="text-lg text-slate-400">/10</span></div>')

    content = content.replace('<span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Top <span className="text-purple-600 font-bold">12%</span> of cohort</span>\n            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target <span className="text-purple-600 font-bold">{dashboardData?.targetSGPA || \'8.0\'}</span></span>', '<span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target <span className="text-purple-600 font-bold">{dashboardData?.targetSGPA || \'8.0\'}</span></span>')

    content = content.replace('<div className="text-3xl font-black text-emerald-600 tracking-tight mb-3">LOW</div>\n          <div className={cn("text-3xl font-black tracking-tight mb-3 uppercase", dashboardData?.academicRisk === \'High\' ? \'text-red-600\' : dashboardData?.academicRisk === \'Medium\' ? \'text-amber-500\' : \'text-emerald-600\')}>{dashboardData?.academicRisk || \'LOW\'}</div>', '<div className={cn("text-3xl font-black tracking-tight mb-3 uppercase", dashboardData?.academicRisk === \'High\' ? \'text-red-600\' : dashboardData?.academicRisk === \'Medium\' ? \'text-amber-500\' : \'text-emerald-600\')}>{dashboardData?.academicRisk || \'LOW\'}</div>')

    content = content.replace('<div className="text-xs font-semibold text-slate-400 mb-2">System operating optimally</div>\n            <div className="text-xs font-semibold text-slate-400 mb-2">ML Analysis Active</div>', '<div className="text-xs font-semibold text-slate-400 mb-2">ML Analysis Active</div>')

    content = content.replace('<div className="h-full flex-1 bg-emerald-500 rounded-full" />\n              <div className={cn("h-full flex-1 rounded-full", dashboardData?.academicRisk === \'High\' ? \'bg-red-500\' : dashboardData?.academicRisk === \'Medium\' ? \'bg-amber-500\' : \'bg-emerald-500\')} />', '<div className={cn("h-full flex-1 rounded-full", dashboardData?.academicRisk === \'High\' ? \'bg-red-500\' : dashboardData?.academicRisk === \'Medium\' ? \'bg-amber-500\' : \'bg-emerald-500\')} />')

    content = content.replace('<div className="text-4xl font-mono-numbers font-black text-brand-900 dark:text-white tracking-tighter mb-3">82<span className="text-lg text-slate-400">%</span></div>\n          <div className="text-4xl font-mono-numbers font-black text-brand-900 dark:text-white tracking-tighter mb-3">{dashboardData?.attendance || 0}<span className="text-lg text-slate-400">%</span></div>', '<div className="text-4xl font-mono-numbers font-black text-brand-900 dark:text-white tracking-tighter mb-3">{dashboardData?.attendance || 0}<span className="text-lg text-slate-400">%</span></div>')

    # Fix chatbot button
    content = re.sub(r'\{/\* Floating AI Button & Widget \*/\}.*', '{/* Floating Action Button */}\n      <ChatbotButton isAIOpen={isAIOpen} setIsAIOpen={setIsAIOpen} roleContext="student" />\n    </div>\n  );\n}', content, flags=re.DOTALL)
    
    if 'ChatbotButton' not in content:
        content = content.replace("import XceloChatbot from '@/components/shared/XceloChatbot';", "import ChatbotButton from '@/components/shared/ChatbotButton';")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base = "c:/Users/adars/Downloads/EduXcel_AI/frontend/src/pages/"
fix_admin(base + "AdminDashboard.tsx")
fix_faculty(base + "FacultyDashboard.tsx")
fix_student(base + "StudentDashboard.tsx")

