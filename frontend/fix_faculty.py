import re

filepath = 'c:/Users/adars/Downloads/EduXcel_AI/frontend/src/pages/FacultyDashboard.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix double BarChart
content = content.replace('<BarChart data={riskDistribution} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>\n              <BarChart data={liveRiskDistribution}', '<BarChart data={liveRiskDistribution}')

# Fix double students mapping
content = content.replace('{students.map((student) => (\n              {studentsList.slice(0, 5).map((student) => (', '{studentsList.slice(0, 5).map((student) => (')

# Fix highRisk text
content = content.replace('The ML model has identified <span className="font-bold text-red-600 dark:text-red-400">17 students</span> at high risk', 'The ML model has identified <span className="font-bold text-red-600 dark:text-red-400">{highRisk} students</span> at high risk')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

