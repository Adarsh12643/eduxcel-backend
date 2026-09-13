import re

filepath = 'c:/Users/adars/Downloads/EduXcel_AI/frontend/src/pages/StudentDashboard.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { default: api } = await import('@/lib/api');
        const res = await api.student.getAssignments();
        if (res.success && res.data) {
          setAssignments(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const statusStyle: Record<string, string> = {
    pending: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800',
    in_progress: 'bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 border-brand-100 dark:border-brand-700',
    graded: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
  };

  const priorityStyle: Record<string, string> = {
    High: 'text-red-600 dark:text-red-400', Medium: 'text-amber-600 dark:text-amber-400', Low: 'text-emerald-600 dark:text-emerald-400',
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading assignments...</div>;

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Assignments</h2><p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track and manage your pending assignments.</p></div>
      <div className="space-y-3">
        {assignments.map((a, i) => {
          const priority = a.score ? 'Low' : 'High'; // Simple heuristic for now
          
          return (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-dark-surface p-5 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{a.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{a.subject?.name || 'Subject'} • {new Date(a.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`text-xs font-bold ${priorityStyle[priority]}`}>{priority}</span>
              <span className={cn('px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border', statusStyle[a.status] || statusStyle.pending)}>
                {(a.status || 'pending').replace('_', ' ')}
              </span>
            </div>
          </motion.div>
        )})}
        {assignments.length === 0 && <p className="text-slate-500 p-4">No assignments found.</p>}
      </div>
    </div>
  );
}"""

pattern = re.compile(r'function AssignmentsPage\(\) \{.*?\n  \}\n', re.DOTALL)
content = pattern.sub(replacement + '\n', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

