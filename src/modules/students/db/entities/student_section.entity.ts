import { Entity, Unique, PrimaryColumn, ManyToOne } from 'typeorm';
import { Student } from './student.entity';
import { Section } from './section.entity';

@Entity()
@Unique(['studentId', 'sectionId'])
export class StudentSection {
  @PrimaryColumn()
  studentId: number;

  @PrimaryColumn()
  sectionId: number;

  @ManyToOne(() => Student, student => student.studentSections)
  student: Student;

  @ManyToOne(() => Section, section => section.studentSections)
  section: Section;
}
