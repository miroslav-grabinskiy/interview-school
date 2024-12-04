import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { Student } from './students/db/entities/student.entity';
import { Section } from './students/db/entities/section.entity';
import { StudentSection } from './students/db/entities/student_section.entity';
import { Teacher } from './students/db/entities/teacher.entity';
import { Subject } from './students/db/entities/subject.entity';
import { Classroom } from './students/db/entities/classroom.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeOrmConfig.options,
      entities: [Student, Section, StudentSection, Teacher, Subject, Classroom],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
