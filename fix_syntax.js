const fs = require('fs');
const files = [
  'frontend/src/pages/StudentDashboard.tsx',
  'frontend/src/pages/FacultyDashboard.tsx',
  'frontend/src/pages/AdminDashboard.tsx'
];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\)\}\}/g, ')}');
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
});
