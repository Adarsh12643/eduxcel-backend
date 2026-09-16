const fs = require('fs');
const path = require('path');
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}
walkDir('./frontend/src/pages', (filePath) => {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    const regex = /<div className="p-6 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-700 dark:to-indigo-700 text-white relative overflow-hidden mb-6">\s*<div className="absolute top-0 right-0 w-64 h-64 bg-white\/10 rounded-full blur-3xl" \/>\s*<div className="relative z-10">\s*<h2 className="text-2xl font-black mb-1">([^<]+)<\/h2>\s*<p className="text-brand-100 text-sm max-w-xl">([^<]*)<\/p>\s*<\/div>\s*<\/div>/g;
    if (regex.test(content)) {
        content = content.replace(regex, '');
        fs.writeFileSync(filePath, content);
        console.log('Removed from ' + filePath);
    }
  }
});
