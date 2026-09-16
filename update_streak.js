const fs = require('fs');

const files = [
  'frontend/src/pages/StudentDashboard.tsx',
  'frontend/src/pages/FacultyDashboard.tsx',
  'frontend/src/pages/AdminDashboard.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Define regex to match the streak block
  const streakRegex = /\{\s*userData\?\.streak\s*>\s*0\s*&&\s*\(\s*<motion\.div[\s\S]*?className="([^"]*?bg-orange-50[^"]*?)"[\s\S]*?>\s*<span className="text-lg animate-pulse">🔥<\/span>\s*<span className="text-sm font-black text-orange-600 dark:text-orange-400">\{userData\.streak\} Day Streak!<\/span>\s*<\/motion\.div>\s*\)/g;
  
  content = content.replace(streakRegex, (match, classes) => {
    return `{userData?.streak > 0 && (
              <div className="${classes}">
                <img src="https://assets-v2.lottiefiles.com/a/2e8b88ac-bc78-11ee-9553-b368dc375ecb/dcGzDVCY9u.gif" alt="Streak Fire" className="w-6 h-6 mix-blend-multiply dark:mix-blend-screen object-contain" />
                <span className="text-sm font-black text-orange-600 dark:text-orange-400">{userData.streak} Day Streak!</span>
              </div>
            )}`;
  });

  fs.writeFileSync(file, content);
  console.log('Updated', file);
});
