import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Teacher } from './teacher.entity';
import { Subject } from './subject.entity';
import { Classroom } from './classroom.entity';
import { StudentSection } from './student_section.entity';
import { EDaysOfWeekSet } from '../../helpers/days.helper';

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Teacher, teacher => teacher.sections)
  teacher: Teacher;

  @ManyToOne(() => Subject, subject => subject.sections)
  subject: Subject;

  @ManyToOne(() => Classroom, classroom => classroom.sections)
  classroom: Classroom;

  @Column('varchar')
  daysOfWeek: EDaysOfWeekSet;

  @Column('int')
  startTime: number; //800

  @Column('int')
  endTime: number; //850

  @OneToMany(() => StudentSection, studentSection => studentSection.section)
  studentSections: StudentSection[];
}
