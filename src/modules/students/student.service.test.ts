/*import { Test } from '@nestjs/testing';
import { StudentService } from './student.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './db/entities/student.entity';
import { Section } from './db/entities/section.entity';
import { EDaysOfWeekSet } from './helpers/days.types';
import { Teacher } from './db/entities/teacher.entity';
import { Classroom } from './db/entities/classroom.entity';
import { Subject } from './db/entities/subject.entity';
import { StudentSection } from './db/entities/student_section.entity';
import { PdfService } from './pdf.service';
import { SectionRepository } from './db/repositories/section.repository';
import { StudentRepository } from './db/repositories/student.repository';
import { StudentSectionRepository } from './db/repositories/student_section.repository';
import { DatabaseModule } from '../DatabaseModule';
import { StudentController } from './student.controller';

describe('StudentService', () => {
  let studentService: StudentService;
  let studentRepository: Repository<Student>;
  let teacherRepository: Repository<Teacher>;
  let classroomRepository: Repository<Classroom>;
  let subjectRepository: Repository<Subject>;
  let sectionRepository: Repository<Section>;
  let studentSectionRepository: Repository<StudentSection>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([Student, Section, StudentSection, Teacher, Subject, Classroom])],
      providers: [StudentService, PdfService, StudentRepository, SectionRepository, StudentSectionRepository],
      controllers: [StudentController],
    }).compile();

    studentService = module.get<StudentService>(StudentService);
    studentRepository = module.get<Repository<Student>>(getRepositoryToken(Student));
    teacherRepository = module.get<Repository<Teacher>>(getRepositoryToken(Teacher));
    classroomRepository = module.get<Repository<Classroom>>(getRepositoryToken(Classroom));
    subjectRepository = module.get<Repository<Subject>>(getRepositoryToken(Subject));
    sectionRepository = module.get<Repository<Section>>(getRepositoryToken(Section));
    studentSectionRepository = module.get<Repository<StudentSection>>(getRepositoryToken(StudentSection));
  });

  async function prepareData() {
    const teacher1 = await teacherRepository.save({ name: 'Teacher 1' });
    const teacher2 = await teacherRepository.save({ name: 'Teacher 2' });
    const classroom1 = await classroomRepository.save({ name: 'Classroom 1' });
    const classroom2 = await classroomRepository.save({ name: 'Classroom 2' });
    const subject1 = await subjectRepository.save({ name: 'Subject 1' });
    const subject2 = await subjectRepository.save({ name: 'Subject 2' });
    const student = await studentRepository.save({ name: 'Student 1' });

    return { teacher1, teacher2, classroom1, classroom2, subject1, subject2, student };
  }

  afterEach(async () => {
    await studentSectionRepository.query('DELETE FROM student_section');
    await sectionRepository.query('DELETE FROM section');
  });

  beforeEach(async () => {
    // Clean up before each test
    await studentSectionRepository.query('DELETE FROM student_section');
    await sectionRepository.query('DELETE FROM section');
    await studentRepository.query('DELETE FROM student');
    await teacherRepository.query('DELETE FROM teacher');
    await classroomRepository.query('DELETE FROM classroom');
    await subjectRepository.query('DELETE FROM subject');
  });

  it('should add a student to a section successfully', async () => {
    const { teacher1, classroom1, subject1, student } = await prepareData();

    const section = await sectionRepository.save({
      teacher: teacher1,
      classroom: classroom1,
      subject: subject1,
      daysOfWeek: EDaysOfWeekSet.MWF,
      startTime: 900,
      endTime: 950,
    });

    await studentService.joinSection(student.id, section.id);

    const updatedSection = await sectionRepository.findOne({ where: { id: section.id }, relations: ['students'] });
    expect(updatedSection.students.length).toBe(1);
    expect(updatedSection.students[0].studentId).toBe(student.id);
  });

  it('should throw an error when adding a student to overlapping sections', async () => {
    const { teacher1, classroom1, subject1, student } = await prepareData();

    const section1 = await sectionRepository.save({
      teacher: teacher1,
      classroom: classroom1,
      subject: subject1,
      daysOfWeek: EDaysOfWeekSet.MWF,
      startTime: 900,
      endTime: 950,
    });

    const section2 = await sectionRepository.save({
      teacher: teacher1,
      classroom: classroom1,
      subject: subject1,
      daysOfWeek: EDaysOfWeekSet.MWF,
      startTime: 940,
      endTime: 1030,
    });

    await studentService.joinSection(student.id, section1.id);

    await expect(studentService.joinSection(student.id, section2.id)).rejects.toThrow('Student is already enrolled in an overlapping section');
  });

  it('should allow adding a student to non-overlapping sections', async () => {
    const { teacher1, classroom1, subject1, student } = await prepareData();

    const section1 = await sectionRepository.save({
      teacher: teacher1,
      classroom: classroom1,
      subject: subject1,
      daysOfWeek: EDaysOfWeekSet.MWF,
      startTime: 900,
      endTime: 950,
    });

    const section2 = await sectionRepository.save({
      teacher: teacher1,
      classroom: classroom1,
      subject: subject1,
      daysOfWeek: EDaysOfWeekSet.MWF,
      startTime: 950,
      endTime: 1040,
    });

    await studentService.joinSection(student.id, section1.id);
    await studentService.joinSection(student.id, section2.id);

    const updatedSection1 = await sectionRepository.findOne({ where: { id: section1.id }, relations: ['students'] });
    const updatedSection2 = await sectionRepository.findOne({ where: { id: section2.id }, relations: ['students'] });

    expect(updatedSection1.students.length).toBe(1);
    expect(updatedSection2.students.length).toBe(1);
    expect(updatedSection1.students[0].studentId).toBe(student.id);
    expect(updatedSection2.students[0].studentId).toBe(student.id);
  });

  it('should handle sections across different days of the week correctly', async () => {
    const { teacher1, classroom1, subject1, student } = await prepareData();

    const section1 = await sectionRepository.save({
      teacher: teacher1,
      classroom: classroom1,
      subject: subject1,
      daysOfWeek: EDaysOfWeekSet.MWF,
      startTime: 900,
      endTime: 950,
    });

    const section2 = await sectionRepository.save({
      teacher: teacher1,
      classroom: classroom1,
      subject: subject1,
      daysOfWeek: EDaysOfWeekSet.TTH,
      startTime: 950,
      endTime: 1040,
    });

    const section3 = await sectionRepository.save({
      teacher: teacher1,
      classroom: classroom1,
      subject: subject1,
      daysOfWeek: EDaysOfWeekSet.MWF,
      startTime: 1050,
      endTime: 1140,
    });

    await studentService.joinSection(student.id, section1.id);
    await studentService.joinSection(student.id, section2.id);
    await studentService.joinSection(student.id, section3.id);

    const updatedSection1 = await sectionRepository.findOne({ where: { id: section1.id }, relations: ['students'] });
    const updatedSection2 = await sectionRepository.findOne({ where: { id: section2.id }, relations: ['students'] });
    const updatedSection3 = await sectionRepository.findOne({ where: { id: section3.id }, relations: ['students'] });

    expect(updatedSection1.students.length).toBe(1);
    expect(updatedSection2.students.length).toBe(1);
    expect(updatedSection3.students.length).toBe(1);
  });

  // Additional cases
});
*/