import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@eduxcel.com' },
    update: {},
    create: {
      email: 'admin@eduxcel.com',
      password: hashedPassword,
      name: 'System Admin',
      role: 'admin',
    },
  });

  const faculty = await prisma.user.upsert({
    where: { email: 'faculty@eduxcel.com' },
    update: {},
    create: {
      email: 'faculty@eduxcel.com',
      password: hashedPassword,
      name: 'Prof. Smith',
      role: 'faculty',
      department: 'Computer Science',
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@eduxcel.com' },
    update: {},
    create: {
      email: 'student@eduxcel.com',
      password: hashedPassword,
      name: 'Arjun Kumar',
      role: 'student',
      rollNumber: 'CS-2024-102',
      department: 'Computer Science',
      semester: 6,
      batch: '2021-2025',
    },
  });

  await prisma.studentProfile.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      currentSGPA: 8.1,
      previousSGPA: 7.8,
      targetSGPA: 8.5,
      overallRisk: 'Low',
      riskScore: 0.25,
      attendance: 82,
      assignmentCompletion: 75,
      internalMarks: 78,
      predictedGrade: 'B+',
      predictedConfidence: 87,
    },
  });

  await prisma.adminProfile.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id },
  });

  await prisma.facultyProfile.upsert({
    where: { userId: faculty.id },
    update: {},
    create: {
      userId: faculty.id,
      specialization: 'Database Systems',
      designation: 'Associate Professor',
    },
  });

  const subjects = [
    { code: 'CS301', name: 'Database Management Systems', description: 'Relational databases, SQL, normalization', credits: 4, semester: 5, department: 'Computer Science', syllabus: 'ER model, SQL, Normalization, Transactions, Indexing' },
    { code: 'CS302', name: 'Operating Systems', description: 'Process management, memory management', credits: 3, semester: 5, department: 'Computer Science', syllabus: 'Processes, Scheduling, Memory Management, File Systems' },
    { code: 'CS303', name: 'Computer Networks', description: 'Network layers, protocols', credits: 3, semester: 5, department: 'Computer Science', syllabus: 'OSI model, TCP/IP, Routing, Security' },
    { code: 'MA301', name: 'Mathematics III', description: 'Advanced engineering mathematics', credits: 4, semester: 5, department: 'Computer Science', syllabus: 'Probability, Statistics, Transforms, Numerical Methods' },
  ];

  for (const subj of subjects) {
    await prisma.subject.upsert({
      where: { code: subj.code },
      update: {},
      create: subj,
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
