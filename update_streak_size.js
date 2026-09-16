const fs = require('fs');
const files = [
  'frontend/src/pages/StudentDashboard.tsx',
  'frontend/src/pages/FacultyDashboard.tsx',
  'frontend/src/pages/AdminDashboard.tsx'
];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/className="w-6 h-6 mix-blend-multiply dark:mix-blend-screen object-contain"/g, 'className="w-8 h-8 scale-[1.3] mix-blend-multiply dark:mix-blend-screen object-contain drop-shadow-sm"');
  fs.writeFileSync(file, content);
  console.log('Updated', file);
});
