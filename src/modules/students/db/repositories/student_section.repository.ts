import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { Section } from '../entities/section.entity';
import { StudentSection } from '../entities/student_section.entity';

@Injectable()
export class StudentSectionRepository {
  constructor(
    @InjectRepository(StudentSection)
    private readonly repository: Repository<StudentSection>
  ) {}

  async addStudentToSection(section: Section, student: Student): Promise<void> {
    try {
      const studentSection = new StudentSection();
      studentSection.studentId = student.id;
      studentSection.sectionId = section.id;
      studentSection.student = student;
      studentSection.section = section;

      await this.repository.save(studentSection);
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
        throw new ConflictException(`Student with ID ${student.id} is already enrolled in section with ID ${section.id}.`);
      }
      throw error;
    }
  }

  async removeSectionFromStudent(sectionId: number, studentId: number): Promise<void> {
    await this.repository.delete({ sectionId, studentId });
  }
}
