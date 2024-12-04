import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { StudentSection } from './student_section.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @OneToMany(() => StudentSection, studentSection => studentSection.student)
  studentSections: StudentSection[];
}
