/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from 'dotenv';
dotenv.config();
import { config } from '../../config/typeorm.config';
import { Teacher } from '../../modules/students/db/entities/teacher.entity';
import { Student } from '../../modules/students/db/entities/student.entity';
import { Subject } from '../../modules/students/db/entities/subject.entity';
import { Section } from '../../modules/students/db/entities/section.entity';
import { Classroom } from '../../modules/students/db/entities/classroom.entity';
import { StudentSection } from '../../modules/students/db/entities/student_section.entity';
import { EDaysOfWeekSet } from '../../modules/students/helpers/days.helper';
import { DataSource } from 'typeorm';
import { join } from 'path';

seed();

async function seed() {
  const dataSource = new DataSource({
    ...config,
    entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
    synchronize: true,
  });

  await dataSource.initialize();

  try {
    await flush(dataSource);
    
    await addTeachers(dataSource);
    await addStudents(dataSource);
    await addSubjects(dataSource);
    await addClassrooms(dataSource);
    await addSections(dataSource);

    console.log('Seed data has been successfully added');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await dataSource.destroy(); // Close the connection after seeding
  }
}

async function flush(dataSource: DataSource) {
  try {
    await dataSource.query('SET CONSTRAINTS ALL DEFERRED');
    
    await dataSource.getRepository(StudentSection).delete({});
    await dataSource.getRepository(Section).delete({});
    await dataSource.getRepository(Student).delete({});
    await dataSource.getRepository(Teacher).delete({});
    await dataSource.getRepository(Subject).delete({});
    await dataSource.getRepository(Classroom).delete({});

    await dataSource.query('SET CONSTRAINTS ALL IMMEDIATE');
  } catch (error) {
    console.error('Error flushing data:', error);
    throw error;
  }
}

async function addTeachers(dataSource: any) {
  const teachers = [
    dataSource.getRepository(Teacher).create({
      name: 'John Doe',
      email: 'john.doe@example.com',
    }),
    dataSource.getRepository(Teacher).create({
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
    }),
    dataSource.getRepository(Student).create({
      name: 'Emily White',
      email: 'emily.white@example.com',
    }),
  ];

  await dataSource.getRepository(Teacher).save(teachers);
}

async function addStudents(dataSource: any) {
  const students = [
    dataSource.getRepository(Student).create({
      name: 'LL',
      email: 'l.l@example.com',
    }),
    dataSource.getRepository(Student).create({
      name: 'John Doe',
      email: 'john.doe@example.com',
    }),
  ];

  await dataSource.getRepository(Student).save(students);
}

async function addSubjects(dataSource: any) {
  const subjects = [
    dataSource.getRepository(Subject).create({ name: 'Mathematics' }),
    dataSource.getRepository(Subject).create({ name: 'Science' }),
    dataSource.getRepository(Subject).create({ name: 'History' }),
  ];

  await dataSource.getRepository(Subject).save(subjects);
}

async function addClassrooms(dataSource: any) {
  const classrooms = [
    dataSource.getRepository(Classroom).create({
      name: 'Room 101',
    }),
    dataSource.getRepository(Classroom).create({
      name: 'Room 102',
    }),
    dataSource.getRepository(Classroom).create({
      name: 'Room 103',
    }),
  ];

  await dataSource.getRepository(Classroom).save(classrooms);
}

async function addSections(dataSource: any) {
  const teacherRepository = dataSource.getRepository(Teacher);
  const subjectRepository = dataSource.getRepository(Subject);
  const classroomRepository = dataSource.getRepository(Classroom);
  const studentRepository = dataSource.getRepository(Student);

  const teachers = await teacherRepository.find();
  const subjects = await subjectRepository.find();
  const classrooms = await classroomRepository.find();
  const llStudent = await studentRepository.findOne({ where: { name: 'LL' } });

  if (!llStudent) {
    console.error('Could not find student LL');
    return;
  }

  async function createSectionWithStudent(sectionData: any, addStudent: boolean) {
    const savedSection = await dataSource.getRepository(Section).save(sectionData);
    
    if (addStudent) {
      await dataSource.getRepository(StudentSection).save({
        studentId: llStudent.id,
        sectionId: savedSection.id,
        status: 'ENROLLED'
      });
    }
    
    return savedSection;
  }

  // MWF Sections
  await createSectionWithStudent({
    teacher: teachers.find(t => t.name === 'John Doe'),
    subject: subjects.find(s => s.name === 'Mathematics'),
    classroom: classrooms.find(c => c.name === 'Room 101'),
    daysOfWeek: [EDaysOfWeekSet.MWF],
    startTime: 800,
    endTime: 850,
  }, true);

  await createSectionWithStudent({
    teacher: teachers.find(t => t.name === 'Alice Johnson'),
    subject: subjects.find(s => s.name === 'Science'),
    classroom: classrooms.find(c => c.name === 'Room 102'),
    daysOfWeek: [EDaysOfWeekSet.MWF],
    startTime: 840,
    endTime: 1000,
  }, false);

  await createSectionWithStudent({
    teacher: teachers.find(t => t.name === 'Alice Johnson'),
    subject: subjects.find(s => s.name === 'Science'),
    classroom: classrooms.find(c => c.name === 'Room 102'),
    daysOfWeek: [EDaysOfWeekSet.MWF],
    startTime: 1000,
    endTime: 1050,
  }, true);

  // EVERYDAY Sections
  await createSectionWithStudent({
    teacher: teachers.find(t => t.name === 'Emily White'),
    subject: subjects.find(s => s.name === 'Science'),
    classroom: classrooms.find(c => c.name === 'Room 102'),
    daysOfWeek: [EDaysOfWeekSet.EVERYDAY],
    startTime: 920,
    endTime: 1010,
  }, false);

  await createSectionWithStudent({
    teacher: teachers.find(t => t.name === 'Emily White'),
    subject: subjects.find(s => s.name === 'Science'),
    classroom: classrooms.find(c => c.name === 'Room 102'),
    daysOfWeek: [EDaysOfWeekSet.EVERYDAY],
    startTime: 1300,
    endTime: 1350,
  }, true);

  // TTH Sections
  await createSectionWithStudent({
    teacher: teachers.find(t => t.name === 'John Doe'),
    subject: subjects.find(s => s.name === 'Mathematics'),
    classroom: classrooms.find(c => c.name === 'Room 101'),
    daysOfWeek: [EDaysOfWeekSet.TTH],
    startTime: 800,
    endTime: 850,
  }, false);

  await createSectionWithStudent({
    teacher: teachers.find(t => t.name === 'Alice Johnson'),
    subject: subjects.find(s => s.name === 'Science'),
    classroom: classrooms.find(c => c.name === 'Room 102'),
    daysOfWeek: [EDaysOfWeekSet.TTH],
    startTime: 840,
    endTime: 1000,
  }, true);

  await createSectionWithStudent({
    teacher: teachers.find(t => t.name === 'Alice Johnson'),
    subject: subjects.find(s => s.name === 'Science'),
    classroom: classrooms.find(c => c.name === 'Room 102'),
    daysOfWeek: [EDaysOfWeekSet.TTH],
    startTime: 1000,
    endTime: 1050,
  }, true);

  await createSectionWithStudent({
    teacher: teachers.find(t => t.name === 'Alice Johnson'),
    subject: subjects.find(s => s.name === 'Science'),
    classroom: classrooms.find(c => c.name === 'Room 102'),
    daysOfWeek: [EDaysOfWeekSet.TTH],
    startTime: 1400,
    endTime: 1450,
  }, true);
}
