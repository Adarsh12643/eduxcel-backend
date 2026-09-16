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
    const regex1 = /<div>\s*<h2 className="text-2xl font-bold[^"]*">([^<]+)<\/h2>\s*<p className="text-slate-500[^"]*">([^<]+)<\/p>\s*<\/div>/g;
    const regex2 = /<div><h2 className="text-2xl font-bold[^"]*">([^<]+)<\/h2><p className="text-slate-500[^"]*">([^<]+)<\/p><\/div>/g;
    const replacement = `<div className="p-6 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-700 dark:to-indigo-700 text-white relative overflow-hidden mb-6">\n        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />\n        <div className="relative z-10">\n          <h2 className="text-2xl font-black mb-1">$1</h2>\n          <p className="text-brand-100 text-sm max-w-xl">$2</p>\n        </div>\n      </div>`;
    if (regex1.test(content) || regex2.test(content)) {
        content = content.replace(regex1, replacement);
        content = content.replace(regex2, replacement);
        fs.writeFileSync(filePath, content);
        console.log('Updated ' + filePath);
    }
  }
});
