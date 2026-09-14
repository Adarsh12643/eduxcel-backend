import re

filepath = 'c:/Users/adars/Downloads/EduXcel_AI/backend/src/controllers/authController.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

onboard_replacement = \"\"\"export const onboard = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const updates = req.body;

    if (user.role === 'student') {
      user.studyHours = updates.studyHours ?? updates.studyHours === 0 ? updates.studyHours : user.studyHours;
      user.weakSubjects = updates.weakSubjects || user.weakSubjects;
      user.learningStyle = updates.learningStyle || user.learningStyle;
      user.stream = updates.stream || user.stream;
      user.course = updates.course || user.course;
      user.college = updates.college || user.college;
      user.semester = updates.semester || user.semester;
      user.section = updates.section || user.section;
      user.previousScores = updates.previousScores || user.previousScores;
    }

    if (user.role === 'student' || user.role === 'faculty') {
      user.department = updates.department || user.department;
    }

    if (user.role === 'faculty') {
      user.subjectsTaught = updates.subjectsTaught || user.subjectsTaught;
    }

    user.batch = updates.batch || user.batch;
    user.rollNumber = updates.rollNumber || user.rollNumber;
    user.employeeId = updates.employeeId || user.employeeId;
    user.targetSGPA = updates.targetSGPA ?? user.targetSGPA;

    user.isOnboarded = true;
    await user.save();

    // Sync previous scores to Prisma for Analytics
    if (user.role === 'student' && updates.previousScores && typeof updates.previousScores === 'object') {
      const prisma = (await import('../config/database')).default;
      
      for (const [subjectName, scores] of Object.entries(updates.previousScores)) {
        const anyScores = scores as any;
        
        let prismaSubject = await prisma.subject.findFirst({
          where: { name: subjectName }
        });

        if (!prismaSubject) {
          prismaSubject = await prisma.subject.create({
            data: {
              name: subjectName,
              code: subjectName.toUpperCase().replace(/\s+/g, '_').substring(0, 10),
              department: user.department || 'General',
              semester: user.semester || updates.semester || 1,
              credits: 3
            }
          });
        }

        await prisma.previousScore.upsert({
          where: {
            userId_subjectId_semester: {
              userId: user.id,
              subjectId: prismaSubject.id,
              semester: user.semester || updates.semester || 1,
            }
          },
          update: {
            sessional1: anyScores.sessional1,
            sessional2: anyScores.sessional2,
            classTest: anyScores.classTest,
            total: anyScores.total
          },
          create: {
            userId: user.id,
            subjectId: prismaSubject.id,
            semester: user.semester || updates.semester || 1,
            sessional1: anyScores.sessional1,
            sessional2: anyScores.sessional2,
            classTest: anyScores.classTest,
            total: anyScores.total
          }
        });
      }
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Onboarding error:', error);
    return res.status(500).json({ success: false, message: 'Onboarding failed' });
  }
};\"\"\"

pattern = r\"export const onboard = async \(req: AuthRequest, res: Response\) => \{[\s\S]*?\}\s*catch\s*\(error\)\s*\{\s*console\.error\('Onboarding error:', error\);\s*return res\.status\(500\)\.json\(\{\s*success:\s*false,\s*message:\s*'Onboarding failed'\s*\}\);\s*\}\s*\};\"
content = re.sub(pattern, onboard_replacement, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
